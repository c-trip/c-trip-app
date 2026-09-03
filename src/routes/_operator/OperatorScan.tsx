import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { IconArrowLeft, IconCamera } from "@tabler/icons-react";
import RouteDisplay from "@/components/RouteDisplay";
import { boardingApi } from "@/services/operator";

type ScanResult =
  | "permission"
  | "loading"
  | "idle"
  | "denied"
  | "validating"
  | "success"
  | "error"
  | "already-boarded";

interface ValidateResponse {
  status: "allowed" | "already_boarded" | "invalid";
  passengerName?: string;
  seat?: number;
  route?: string;
}

/**
 * POST /boarding/scan — valida o QR e regista o embarque num só passo.
 * Devolve `boarded`/`allowed` (acabou de embarcar), `already_boarded`, ou `invalid`.
 * Lança em caso de erro de rede/servidor (tratado pelo caller como estado "error").
 */
async function scanBoarding(qrHash: string): Promise<ValidateResponse> {
  const res = await boardingApi.scan({ qr_hash: qrHash });
  const ok = res.status === "boarded" || res.status === "allowed";
  return {
    status: ok ? "allowed" : res.status === "already_boarded" ? "already_boarded" : "invalid",
    passengerName: res.passenger,
    seat: res.seat_number,
    route: res.destination,
  };
}

export default function OperatorScan() {
  const navigate = useNavigate();
  const [scanState, setScanState] = useState<ScanResult>("permission");
  const [scannedData, setScannedData] = useState<ValidateResponse | null>(null);
  const scannerRef = useRef<import("html5-qrcode").Html5Qrcode | null>(null);
  const cancelledRef = useRef(false);

  const cleanupScanner = async () => {
    const scanner = scannerRef.current;
    if (scanner) {
      try {
        if (scanner.isScanning) {
          await scanner.stop();
        }
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

  const startCamera = async () => {
    cancelledRef.current = false;
    setScanState("loading");
    try {
      const permStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      if (cancelledRef.current) { permStream.getTracks().forEach((t) => t.stop()); return; }
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
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        },
        async (decodedText) => {
          if (cancelledRef.current) return;
          await cleanupScanner();
          setScanState("validating");
          try {
            const result = await scanBoarding(decodedText);
            if (cancelledRef.current) return;
            setScannedData(result);
            if (result.status === "allowed") {
              navigate("/operator/scan-result-success", { state: result });
              return;
            }
            if (result.status === "already_boarded")
              setScanState("already-boarded");
            else setScanState("error");
          } catch {
            if (!cancelledRef.current) setScanState("error");
          }
        },
        () => {},
      );

      if (cancelledRef.current) {
        try { await scanner.stop(); } catch { /* ignore */ }
        return;
      }
      setScanState("idle");
    } catch {
      if (!cancelledRef.current) setScanState("denied");
    }
  };

  const handleRetry = () => {
    cleanupScanner();
    setScannedData(null);
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
          <h1 className="text-[22px] font-bold text-white text-center flex-1">
            Escanear Bilhete
          </h1>
          <span className="text-[10px] font-bold uppercase tracking-wide text-white/60 bg-white/10 rounded-full px-2 py-1">
            Protótipo
          </span>
        </div>
      </header>

      <main className="px-5 pb-8 flex flex-col items-center">
        {scanState === "permission" && (
          <div className="flex flex-col items-center gap-6 py-16">
            <div className="size-24 rounded-full bg-white/10 flex items-center justify-center">
              <IconCamera className="size-12 text-white" />
            </div>
            <div className="text-center">
              <p className="text-white font-bold text-lg mb-1">
                Escanear QR Code
              </p>
              <p className="text-gray-400 text-sm leading-relaxed max-w-[260px]">
                Toque no botão abaixo para activar a câmara e escanear o bilhete
                do passageiro.
              </p>
            </div>
            <button
              type="button"
              onClick={startCamera}
              className="w-full max-w-[280px] py-3.5 bg-[#1B7A3D] text-white font-semibold rounded-xl hover:bg-[#15632F] transition-colors active:scale-[0.98]"
            >
              Abrir Câmara
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

        {scanState === "denied" && (
          <div className="flex flex-col items-center gap-6 py-16">
            <div className="size-24 rounded-full bg-white/10 flex items-center justify-center">
              <svg
                className="size-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.182 16.318A4.486 4.486 0 0012.016 15a4.486 4.486 0 00-3.198 1.318M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z"
                />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-white font-bold text-lg mb-1">
                Câmara Indisponível
              </p>
              <p className="text-gray-400 text-sm leading-relaxed max-w-[260px]">
                Permita o acesso à câmara nas definições do navegador e tente
                novamente.
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

              {scanState === "idle" && (
                <div className="qr-viewfinder" aria-hidden="true" />
              )}

              {scanState === "loading" && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-10">
                  <div className="flex flex-col items-center gap-3">
                    <div className="size-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span className="text-white text-sm font-outfit">
                      A iniciar câmara...
                    </span>
                  </div>
                </div>
              )}
            </div>
            <div className="mt-6 text-center">
              <p className="text-white text-sm font-semibold mb-1">
                Aponte a câmara ao QR code do passageiro
              </p>
              <p className="text-gray-400 text-xs">
                Mantenha a câmara estável e o código dentro da área verde
              </p>
            </div>
          </>
        )}

        {scanState === "validating" && (
          <div className="flex flex-col items-center gap-4 py-20">
            <div className="size-12 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span className="text-white text-sm">A validar bilhete...</span>
          </div>
        )}

        {scanState === "success" && scannedData && (
          <div className="flex flex-col items-center gap-5 py-12 w-full max-w-xs">
            <div className="size-20 rounded-full bg-[#1B7A3D] flex items-center justify-center animate-scale-in">
              <svg
                className="size-10 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-white font-bold text-lg">Bilhete Válido</p>
              <p className="text-gray-400 text-sm mt-1">Embarque autorizado</p>
            </div>
            <div className="w-full bg-white/10 rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Passageiro</span>
                <span className="text-white font-semibold">
                  {scannedData.passengerName}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Lugar</span>
                <span className="text-white font-semibold">
                  {scannedData.seat}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Rota</span>
                <span className="text-white font-semibold">
                  <RouteDisplay route={scannedData.route} />
                </span>
              </div>
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

        {scanState === "already-boarded" && (
          <div className="flex flex-col items-center gap-5 py-12 w-full max-w-xs">
            <div className="size-20 rounded-full bg-yellow-500 flex items-center justify-center animate-scale-in">
              <svg
                className="size-10 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
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
                Este passageiro já fez check-in
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
              <svg
                className="size-10 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-white font-bold text-lg">Bilhete Inválido</p>
              <p className="text-gray-400 text-sm mt-1">
                QR code não reconhecido
              </p>
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
