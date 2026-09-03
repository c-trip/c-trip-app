import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { IconArrowLeft, IconCamera } from "@tabler/icons-react";
import { gooeyToast } from "goey-toast";
import RouteDisplay from "@/components/RouteDisplay";
import { boardingApi } from "@/services/operator";

type ScanState =
  | "permission"
  | "loading"
  | "idle"
  | "denied"
  | "validating"
  | "success"
  | "error"
  | "already-boarded";

/** `board` = valida + regista num passo. `verify` = só verifica (não regista). */
type ScanMode = "board" | "verify";

interface ScanInfo {
  status: "allowed" | "already_boarded" | "invalid";
  passengerName?: string;
  seat?: number;
  route?: string;
  firstBoardedAt?: string;
  reason?: string;
}

function toInfo(res: Awaited<ReturnType<typeof boardingApi.scan>>): ScanInfo {
  const ok = res.status === "boarded" || res.status === "allowed";
  return {
    status: ok ? "allowed" : res.status === "already_boarded" ? "already_boarded" : "invalid",
    passengerName: res.passenger,
    seat: res.seat_number,
    route: res.destination,
    firstBoardedAt: res.first_boarded_at || undefined,
    reason: res.reason || undefined,
  };
}

function formatTime(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? ""
    : d.toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" });
}

export default function OperatorScan() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<ScanMode>("board");
  const [scanState, setScanState] = useState<ScanState>("permission");
  const [scanned, setScanned] = useState<ScanInfo | null>(null);
  const [recorded, setRecorded] = useState(false);
  const [recording, setRecording] = useState(false);
  const lastQrRef = useRef<string | null>(null);
  const scannerRef = useRef<import("html5-qrcode").Html5Qrcode | null>(null);
  const cancelledRef = useRef(false);

  const cleanupScanner = async () => {
    const scanner = scannerRef.current;
    if (scanner) {
      try {
        if (scanner.isScanning) await scanner.stop();
      } catch {
        /* ignore */
      }
      try {
        scanner.clear();
      } catch {
        /* ignore */
      }
      scannerRef.current = null;
    }

    const region = document.getElementById("qr-scanner-region");
    if (region) {
      region.querySelectorAll("video").forEach((v) => {
        const stream = v.srcObject as MediaStream | null;
        stream?.getTracks().forEach((t) => t.stop());
        v.remove();
      });
      region.querySelectorAll("canvas").forEach((c) => c.remove());
    }
  };

  useEffect(() => {
    return () => {
      cancelledRef.current = true;
      cleanupScanner();
    };
  }, []);

  const handleDecoded = async (decodedText: string, scanMode: ScanMode) => {
    if (cancelledRef.current) return;
    await cleanupScanner();
    lastQrRef.current = decodedText;
    setScanState("validating");
    try {
      const raw =
        scanMode === "board"
          ? await boardingApi.scan({ qr_hash: decodedText })
          : await boardingApi.validateQr({ qr_hash: decodedText });
      if (cancelledRef.current) return;
      const info = toInfo(raw);
      setScanned(info);

      if (info.status === "invalid") {
        setScanState("error");
        return;
      }
      if (info.status === "already_boarded") {
        setScanState("already-boarded");
        return;
      }
      // allowed
      if (scanMode === "board") {
        setRecorded(true);
        navigate("/operator/scan-result-success", { state: info });
        return;
      }
      // verify mode → fica no ecrã com o botão "Registar embarque"
      setRecorded(false);
      setScanState("success");
    } catch {
      if (!cancelledRef.current) setScanState("error");
    }
  };

  const startCamera = async (scanMode: ScanMode) => {
    cancelledRef.current = false;
    setScanState("loading");
    try {
      const permStream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (cancelledRef.current) {
        permStream.getTracks().forEach((t) => t.stop());
        return;
      }
      permStream.getTracks().forEach((t) => t.stop());

      const { Html5Qrcode } = await import("html5-qrcode");
      if (cancelledRef.current) return;

      const devices = await Html5Qrcode.getCameras();
      if (cancelledRef.current) return;
      if (!devices || devices.length === 0) {
        setScanState("denied");
        return;
      }

      const rear = devices.find(
        (d) =>
          d.label.toLowerCase().includes("back") ||
          d.label.toLowerCase().includes("traseira"),
      );
      const cameraId = rear?.id || devices[devices.length - 1].id;

      const scanner = new Html5Qrcode("qr-scanner-region", { verbose: false });
      scannerRef.current = scanner;

      await scanner.start(
        cameraId,
        { fps: 10, qrbox: { width: 250, height: 250 }, aspectRatio: 1.0 },
        (decodedText) => void handleDecoded(decodedText, scanMode),
        () => {},
      );

      if (cancelledRef.current) {
        try {
          await scanner.stop();
        } catch {
          /* ignore */
        }
        return;
      }
      setScanState("idle");
    } catch {
      if (!cancelledRef.current) setScanState("denied");
    }
  };

  const handleRecord = async () => {
    if (!lastQrRef.current || recording) return;
    setRecording(true);
    try {
      await boardingApi.recordBoarding({ qr_hash: lastQrRef.current });
      setRecorded(true);
      gooeyToast.success("Embarque registado", {
        description: scanned?.passengerName ? `${scanned.passengerName} — Lugar ${scanned.seat}` : undefined,
      });
    } catch {
      gooeyToast.error("Não foi possível registar", { description: "Tente novamente." });
    } finally {
      setRecording(false);
    }
  };

  const handleRetry = () => {
    cleanupScanner();
    setScanned(null);
    setRecorded(false);
    lastQrRef.current = null;
    setScanState("permission");
  };

  const handleGoBack = () => {
    cleanupScanner();
    navigate("/operator");
  };

  return (
    <div className="min-h-screen bg-black font-outfit">
      <header className="sticky top-0 z-50 bg-black px-5 pt-3 pb-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleGoBack}
            aria-label="Voltar ao painel"
            className="p-1 rounded-full hover:bg-white/10"
          >
            <IconArrowLeft className="size-5 text-white" />
          </button>
          <h1 className="text-[22px] font-bold text-white text-center flex-1">Escanear Bilhete</h1>
          <span className="w-5" />
        </div>
      </header>

      <main className="px-5 pb-8 flex flex-col items-center">
        {scanState === "permission" && (
          <div className="flex flex-col items-center gap-6 py-14 w-full max-w-[300px]">
            <div className="size-24 rounded-full bg-white/10 flex items-center justify-center">
              <IconCamera className="size-12 text-white" />
            </div>
            <div className="text-center">
              <p className="text-white font-bold text-lg mb-1">Escanear QR Code</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                Escolha a acção e active a câmara para ler o bilhete do passageiro.
              </p>
            </div>

            <div className="flex w-full gap-2 rounded-xl bg-white/10 p-1">
              {([
                { key: "board", label: "Embarcar" },
                { key: "verify", label: "Só verificar" },
              ] as const).map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setMode(opt.key)}
                  className={`flex-1 h-9 rounded-lg text-xs font-semibold transition-colors ${
                    mode === opt.key ? "bg-white text-black" : "text-white/70"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <p className="-mt-3 text-[11px] text-gray-500 text-center">
              {mode === "board"
                ? "Valida e regista o embarque de imediato."
                : "Só mostra se o bilhete é válido — não regista o embarque."}
            </p>

            <button
              type="button"
              onClick={() => void startCamera(mode)}
              className="w-full py-3.5 bg-[#1B7A3D] text-white font-semibold rounded-xl hover:bg-[#15632F] transition-colors active:scale-[0.98]"
            >
              Abrir Câmara
            </button>
            <button
              type="button"
              onClick={handleGoBack}
              className="w-full py-3.5 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors"
            >
              Voltar ao Painel
            </button>
          </div>
        )}

        {scanState === "denied" && (
          <div className="flex flex-col items-center gap-6 py-16">
            <div className="size-24 rounded-full bg-white/10 flex items-center justify-center">
              <IconCamera className="size-12 text-gray-400" />
            </div>
            <div className="text-center">
              <p className="text-white font-bold text-lg mb-1">Câmara Indisponível</p>
              <p className="text-gray-400 text-sm leading-relaxed max-w-[260px]">
                Permita o acesso à câmara nas definições do navegador e tente novamente.
              </p>
            </div>
            <button
              type="button"
              onClick={handleRetry}
              className="w-full max-w-[280px] py-3.5 bg-[#1B7A3D] text-white font-semibold rounded-xl hover:bg-[#15632F] transition-colors"
            >
              Tentar Novamente
            </button>
            <button
              type="button"
              onClick={handleGoBack}
              className="w-full max-w-[280px] py-3.5 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors"
            >
              Voltar ao Painel
            </button>
          </div>
        )}

        {(scanState === "idle" || scanState === "loading") && (
          <>
            <div
              className="relative w-full overflow-hidden bg-black rounded-2xl"
              style={{ aspectRatio: "1 / 1", maxWidth: 290 }}
            >
              <div
                id="qr-scanner-region"
                className="w-full h-full [&>video]:w-full [&>video]:h-full [&>video]:object-cover"
              />
              {scanState === "idle" && <div className="qr-viewfinder" aria-hidden="true" />}
              {scanState === "loading" && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-10">
                  <div className="flex flex-col items-center gap-3">
                    <div className="size-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span className="text-white text-sm">A iniciar câmara...</span>
                  </div>
                </div>
              )}
            </div>
            <div className="mt-6 text-center">
              <p className="text-white text-sm font-semibold mb-1">
                {mode === "board" ? "Aponte ao QR para embarcar" : "Aponte ao QR para verificar"}
              </p>
              <p className="text-gray-400 text-xs">Mantenha o código dentro da área verde</p>
            </div>
          </>
        )}

        {scanState === "validating" && (
          <div className="flex flex-col items-center gap-4 py-20">
            <div className="size-12 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span className="text-white text-sm">
              {mode === "board" ? "A registar embarque..." : "A validar bilhete..."}
            </span>
          </div>
        )}

        {scanState === "success" && scanned && (
          <div className="flex flex-col items-center gap-5 py-12 w-full max-w-xs">
            <div className="size-20 rounded-full bg-[#1B7A3D] flex items-center justify-center animate-scale-in">
              <svg className="size-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-white font-bold text-lg">
                {recorded ? "Embarque registado" : "Bilhete válido"}
              </p>
              <p className="text-gray-400 text-sm mt-1">
                {recorded ? "Passageiro embarcado" : "Ainda não embarcou"}
              </p>
            </div>
            <div className="w-full bg-white/10 rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Passageiro</span>
                <span className="text-white font-semibold">{scanned.passengerName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Lugar</span>
                <span className="text-white font-semibold">{scanned.seat}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Rota</span>
                <span className="text-white font-semibold">
                  <RouteDisplay route={scanned.route} />
                </span>
              </div>
            </div>

            {!recorded && (
              <button
                type="button"
                onClick={handleRecord}
                disabled={recording}
                className="w-full py-3 bg-[#1B7A3D] text-white font-semibold rounded-xl hover:bg-[#15632F] transition-colors disabled:opacity-50"
              >
                {recording ? "A registar..." : "Registar embarque"}
              </button>
            )}
            <button
              type="button"
              onClick={handleRetry}
              className="w-full py-3 bg-white text-black font-semibold rounded-xl hover:bg-gray-100 transition-colors"
            >
              Escanear outro
            </button>
            <button
              type="button"
              onClick={handleGoBack}
              className="w-full py-3 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors"
            >
              Voltar ao painel
            </button>
          </div>
        )}

        {scanState === "already-boarded" && (
          <div className="flex flex-col items-center gap-5 py-12 w-full max-w-xs">
            <div className="size-20 rounded-full bg-yellow-500 flex items-center justify-center animate-scale-in">
              <svg className="size-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-white font-bold text-lg">Já Embarcado</p>
              <p className="text-gray-400 text-sm mt-1">
                {scanned?.firstBoardedAt
                  ? `Check-in às ${formatTime(scanned.firstBoardedAt)}`
                  : "Este passageiro já fez check-in"}
              </p>
            </div>
            <button
              type="button"
              onClick={handleRetry}
              className="w-full py-3 bg-white text-black font-semibold rounded-xl hover:bg-gray-100 transition-colors"
            >
              Escanear outro
            </button>
            <button
              type="button"
              onClick={handleGoBack}
              className="w-full py-3 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors"
            >
              Voltar ao painel
            </button>
          </div>
        )}

        {scanState === "error" && (
          <div className="flex flex-col items-center gap-5 py-12 w-full max-w-xs">
            <div className="size-20 rounded-full bg-red-500 flex items-center justify-center animate-scale-in">
              <svg className="size-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-white font-bold text-lg">Bilhete Inválido</p>
              <p className="text-gray-400 text-sm mt-1">{scanned?.reason || "QR code não reconhecido"}</p>
            </div>
            <button
              type="button"
              onClick={handleRetry}
              className="w-full py-3 bg-white text-black font-semibold rounded-xl hover:bg-gray-100 transition-colors"
            >
              Tentar novamente
            </button>
            <button
              type="button"
              onClick={handleGoBack}
              className="w-full py-3 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors"
            >
              Voltar ao painel
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
