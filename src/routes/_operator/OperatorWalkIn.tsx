import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import {
  IconArrowLeft,
  IconBus,
  IconUser,
  IconId,
  IconPhone,
  IconCheck,
  IconChevronDown,
} from "@tabler/icons-react";
import { gooeyToast } from "goey-toast";
import { useOperatorSchedules } from "@/hooks/operator/useOperatorSchedules";
import { useManifest } from "@/hooks/operator/useManifest";
import { useSellTicket } from "@/hooks/operator/useSellTicket";
import { useWalkInBoarding } from "@/hooks/operator/useBoarding";
import type { OperatorSchedule, SellTicketResponse, WalkInBoardingResponse } from "@/types/operator";
import { formatKz } from "@/lib/format";
import RouteDisplay from "@/components/RouteDisplay";
import StickyFooter from "@/components/StickyFooter";
import GradientButton from "@/components/GradientButton";

type Mode = "ticket" | "walkin";
type SeatStatus = "available" | "occupied";
type Result =
  | { kind: "ticket"; data: SellTicketResponse }
  | { kind: "walkin"; data: WalkInBoardingResponse };

function SeatButton({
  label,
  status,
  selected,
  dimmed,
  onClick,
}: {
  label: string;
  status: SeatStatus;
  selected: boolean;
  dimmed: boolean;
  onClick: () => void;
}) {
  const base =
    "border border-[#E5E7EB] text-[13px] font-bold w-[52px] h-10 flex items-center justify-center rounded-lg transition-all";

  if (status === "occupied") {
    return (
      <button type="button" onClick={onClick} aria-label={`Lugar ${label} ocupado`}
        className={`${base} text-[#9CA3AF] bg-[#F3F4F6] cursor-not-allowed`}>
        {label}
      </button>
    );
  }
  if (selected) {
    return (
      <button type="button" onClick={onClick} aria-pressed
        className={`${base} text-white bg-[#15632F] scale-110 ring-2 ring-white shadow-lg`}>
        {label}
      </button>
    );
  }
  return (
    <button type="button" onClick={onClick}
      className={`${base} text-white bg-[#1B7A3D] ${dimmed ? "opacity-40 hover:opacity-100" : "hover:scale-105"}`}>
      {label}
    </button>
  );
}

interface WalkInForm {
  name: string;
  phone: string;
  idDoc: string;
  seatNumber: string;
}

const EMPTY_FORM: WalkInForm = { name: "", phone: "", idDoc: "", seatNumber: "" };

export default function OperatorWalkIn() {
  const navigate = useNavigate();
  const { schedules } = useOperatorSchedules();
  const sellable = schedules.filter((s) => s.status !== "departed" && s.status !== "cancelled");

  const [mode, setMode] = useState<Mode>("ticket");
  const [selectedSchedule, setSelectedSchedule] = useState<OperatorSchedule | null>(null);
  const [showSchedulePicker, setShowSchedulePicker] = useState(false);
  const [form, setForm] = useState<WalkInForm>(EMPTY_FORM);
  const [result, setResult] = useState<Result | null>(null);

  const { manifest } = useManifest(selectedSchedule?.schedule_id);
  const { sell, isLoading: selling } = useSellTicket();
  const { walkIn, isLoading: boarding } = useWalkInBoarding();
  const submitting = selling || boarding;

  const occupiedSet = useMemo(
    () => new Set(manifest.filter((m) => m.status !== "cancelled").map((m) => m.seat)),
    [manifest],
  );

  const setField = (field: keyof WalkInForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const seatLabel = (seat: number) => String(seat).padStart(2, "0");
  const seatNumber = Number(form.seatNumber);
  const selectedSeat =
    Number.isInteger(seatNumber) && seatNumber >= 1 ? seatLabel(seatNumber) : null;
  const totalSeats = selectedSchedule?.total_seats ?? 0;
  const price = selectedSchedule?.price ?? 0;

  const handleSeatClick = (seat: number) => {
    if (occupiedSet.has(seat)) {
      gooeyToast.error("Lugar ocupado", { description: `O lugar ${seatLabel(seat)} já está ocupado.` });
      return;
    }
    setField("seatNumber", seatNumber === seat ? "" : String(seat));
  };

  const isValid =
    form.name.trim().length >= 2 &&
    selectedSchedule !== null &&
    Number.isInteger(seatNumber) &&
    seatNumber >= 1 &&
    seatNumber <= totalSeats &&
    !occupiedSet.has(seatNumber) &&
    price > 0;

  const handleSubmit = async () => {
    if (!isValid || submitting || !selectedSchedule) return;

    const common = {
      schedule_id: selectedSchedule.schedule_id,
      seat_number: seatNumber,
      passenger_name: form.name.trim(),
      passenger_phone: form.phone.trim() || undefined,
      passenger_id_doc: form.idDoc.trim() || undefined,
      total_price: price,
    };

    if (mode === "walkin") {
      const res = await walkIn({ ...common, payment_method: "cash" });
      if (res) {
        setResult({ kind: "walkin", data: res });
        gooeyToast.success("Embarque registado", {
          description: `${res.passenger_name} — Lugar ${res.seat_number}`,
        });
      } else {
        gooeyToast.error("Erro no embarque", { description: "Verifique os dados e tente novamente." });
      }
      return;
    }

    const res = await sell({
      ...common,
      passenger_phone: form.phone.trim(),
      passenger_id_doc: form.idDoc.trim(),
      payment_method: "cash",
    });
    if (res) {
      setResult({ kind: "ticket", data: res });
      gooeyToast.success("Bilhete vendido", {
        description: `${res.passenger_name} — Lugar ${res.seat_number}`,
      });
    } else {
      gooeyToast.error("Erro ao vender", { description: "Verifique os dados e tente novamente." });
    }
  };

  const handleReset = () => {
    setForm(EMPTY_FORM);
    setResult(null);
  };

  if (result) {
    const p = result.data;
    return (
      <div className="min-h-screen bg-[#F9FAFB] font-outfit">
        <header className="sticky top-0 z-50 bg-[#FFFFFF] px-5 pt-3 pb-4 border-b border-gray-200">
          <div className="flex items-center gap-2 bg-white">
            <button type="button" onClick={() => navigate("/operator")} aria-label="Voltar ao painel"
              className="p-1 rounded-full hover:bg-gray-100">
              <IconArrowLeft className="size-5 text-gray-600" />
            </button>
            <h1 className="text-[22px] font-bold text-[#111827] text-center flex-1">
              {result.kind === "walkin" ? "Embarque à Porta" : "Venda ao Balcão"}
            </h1>
          </div>
        </header>

        <main className="px-5 py-10 flex flex-col items-center gap-6">
          <div className="size-20 rounded-full bg-[#1B7A3D] flex items-center justify-center animate-scale-in">
            <IconCheck className="size-10 text-white" strokeWidth={3} />
          </div>
          <div className="text-center">
            <p className="text-[#111827] font-bold text-lg">
              {result.kind === "walkin" ? "Passageiro embarcado" : "Bilhete vendido com sucesso"}
            </p>
            <p className="text-gray-500 text-sm mt-1">
              {p.passenger_name} — Lugar {p.seat_number}
            </p>
            {result.kind === "ticket" && (
              <p className="text-gray-400 text-xs mt-1">
                <RouteDisplay origin={result.data.origin} destination={result.data.destination} /> ·{" "}
                {result.data.departure_time}
              </p>
            )}
          </div>

          {result.kind === "ticket" && result.data.qr_image && (
            <>
              <img src={result.data.qr_image} alt="QR code do bilhete"
                className="size-48 rounded-xl border border-gray-200 bg-white p-2" />
              <p className="text-[11px] text-gray-400 break-all max-w-xs text-center">{result.data.qr_hash}</p>
            </>
          )}

          <div className="flex flex-col gap-3 w-full max-w-xs">
            <button type="button" onClick={handleReset}
              className="w-full py-3 bg-[#1B7A3D] text-white font-semibold rounded-xl hover:bg-[#15632F] transition-colors">
              Nova operação
            </button>
            <button type="button" onClick={() => navigate("/operator")}
              className="w-full py-3 bg-white text-[#111827] border border-gray-200 font-semibold rounded-xl hover:bg-gray-50 transition-colors">
              Voltar ao painel
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-outfit">
      <header className="sticky top-0 z-50 bg-white px-5 pt-3 pb-4 border-b border-gray-200">
        <div className="flex justify-baseline gap-2">
          <button type="button" onClick={() => navigate("/operator")} aria-label="Voltar ao painel"
            className="p-1 rounded-full hover:bg-gray-100">
            <IconArrowLeft className="size-7 text-[#111827]" />
          </button>
          <div className="flex flex-col">
            <h1 className="text-[22px] font-bold text-[#111827]">Venda ao Balcão</h1>
            <span className="text-[13px] text-[#4B5563] font-normal">Bilhete local ou embarque à porta</span>
          </div>
        </div>
      </header>

      <main className="px-5 py-5 pb-44">
        <div className="mb-6 flex gap-2 rounded-xl bg-gray-100 p-1">
          {([
            { key: "ticket", label: "Emitir bilhete (QR)" },
            { key: "walkin", label: "Embarque à porta" },
          ] as const).map((opt) => (
            <button
              key={opt.key}
              type="button"
              onClick={() => setMode(opt.key)}
              className={`flex-1 h-9 rounded-lg text-xs font-semibold transition-colors ${
                mode === opt.key ? "bg-white text-[#1B7A3D] shadow-sm" : "text-[#6B7280]"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <section className="mb-6">
          <label className="block text-xs font-bold text-[#6B7280] uppercase tracking-wide mb-2">Viagem</label>
          <button
            type="button"
            onClick={() => setShowSchedulePicker(!showSchedulePicker)}
            className="w-full flex items-center justify-between p-3.5 bg-white border border-gray-200 rounded-xl text-left hover:border-[#1B7A3D] transition-colors"
          >
            {selectedSchedule ? (
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-full bg-[#1B7A3D]/10 flex items-center justify-center shrink-0">
                  <IconBus className="size-4 text-[#1B7A3D]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#111827]">
                    <RouteDisplay origin={selectedSchedule.origin} destination={selectedSchedule.destination} />
                  </p>
                  <p className="text-[11px] text-gray-500">
                    {selectedSchedule.departure_time} · {formatKz(selectedSchedule.price)} · {selectedSchedule.available_seats} livres
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                  <IconBus className="size-4 text-gray-400" />
                </div>
                <span className="text-sm text-gray-400">Selecionar viagem...</span>
              </div>
            )}
            <IconChevronDown className={`size-5 text-gray-400 transition-transform ${showSchedulePicker ? "rotate-180" : ""}`} />
          </button>

          {showSchedulePicker && (
            <div className="mt-2 bg-white border border-gray-200 rounded-xl overflow-hidden">
              {sellable.filter((s) => s.available_seats > 0).length === 0 && (
                <p className="p-3 text-sm text-gray-400">Sem viagens com lugares disponíveis.</p>
              )}
              {sellable
                .filter((s) => s.available_seats > 0)
                .map((s) => (
                  <button
                    key={s.schedule_id}
                    type="button"
                    onClick={() => {
                      setSelectedSchedule(s);
                      setField("seatNumber", "");
                      setShowSchedulePicker(false);
                    }}
                    className={`w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                      selectedSchedule?.schedule_id === s.schedule_id ? "bg-[#1B7A3D]/5" : ""
                    }`}
                  >
                    <div className="size-9 rounded-full bg-[#1B7A3D]/10 flex items-center justify-center shrink-0">
                      <IconBus className="size-4 text-[#1B7A3D]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-[#111827]">
                        <RouteDisplay origin={s.origin} destination={s.destination} />
                      </p>
                      <p className="text-[11px] text-gray-500">{s.departure_time} · {formatKz(s.price)}</p>
                    </div>
                    <span className="text-xs font-semibold text-[#1B7A3D]">{s.available_seats} disp.</span>
                  </button>
                ))}
            </div>
          )}
        </section>

        <section className="flex flex-col gap-2 mb-6">
          <p className="text-sm text-[#111827] font-bold">Selecione o lugar</p>
          {selectedSchedule && totalSeats > 0 ? (
            <div className="border border-[#E5E7EB] bg-white rounded-xl p-3 grid grid-cols-5 gap-2 justify-items-center">
              {Array.from({ length: totalSeats }, (_, i) => i + 1).map((seat) => (
                <SeatButton
                  key={seat}
                  label={seatLabel(seat)}
                  status={occupiedSet.has(seat) ? "occupied" : "available"}
                  selected={selectedSeat === seatLabel(seat)}
                  dimmed={selectedSeat !== null && seatLabel(seat) !== selectedSeat && !occupiedSet.has(seat)}
                  onClick={() => handleSeatClick(seat)}
                />
              ))}
            </div>
          ) : (
            <div className="border border-[#E5E7EB] bg-white h-28 rounded-xl p-3 flex items-center justify-center">
              <p className="text-sm text-gray-400">Selecionar viagem para ver os lugares</p>
            </div>
          )}
        </section>

        <section className="space-y-4">
          <h2 className="text-xs font-bold text-[#6B7280] uppercase tracking-wide">Dados do passageiro</h2>

          <div>
            <label htmlFor="walkin-name" className="block text-xs font-bold text-[#6B7280] uppercase tracking-wide mb-2">
              Nome completo
            </label>
            <div className="relative">
              <IconUser className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                id="walkin-name" type="text" value={form.name}
                onChange={(e) => setField("name", e.target.value)}
                placeholder="Nome completo"
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-outfit placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1B7A3D]/30 focus:border-[#1B7A3D]"
              />
            </div>
          </div>

          <div>
            <label htmlFor="walkin-phone" className="block text-xs font-bold text-[#6B7280] uppercase tracking-wide mb-2">
              Telefone
            </label>
            <div className="relative">
              <IconPhone className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                id="walkin-phone" type="tel" value={form.phone}
                onChange={(e) => setField("phone", e.target.value)}
                placeholder="Ex: 923 456 789"
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-outfit placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1B7A3D]/30 focus:border-[#1B7A3D]"
              />
            </div>
          </div>

          <div>
            <label htmlFor="walkin-idoc" className="block text-xs font-bold text-[#6B7280] uppercase tracking-wide mb-2">
              Documento de identificação
            </label>
            <div className="relative">
              <IconId className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                id="walkin-idoc" type="text" value={form.idDoc}
                onChange={(e) => setField("idDoc", e.target.value)}
                placeholder="Número do BI"
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-outfit placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1B7A3D]/30 focus:border-[#1B7A3D]"
              />
            </div>
          </div>
        </section>
      </main>

      <StickyFooter className="fixed bottom-[70px] left-0 right-0 z-50">
        <div className="flex justify-between gap-1 items-center w-full">
          <p className="text-sm text-[#4B5563] font-normal font-inter">Valor a pagar (dinheiro)</p>
          <p className="text-[#1B7A3D] text-[22px] font-extrabold font-outfit">
            {price > 0 ? formatKz(price) : "—"}
          </p>
        </div>
        <GradientButton onClick={handleSubmit} disabled={!isValid || submitting}>
          {submitting ? (
            <span className="flex items-center justify-center gap-2">
              <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              A processar...
            </span>
          ) : mode === "walkin" ? (
            "Registar embarque à porta"
          ) : (
            "Emitir e imprimir bilhete"
          )}
        </GradientButton>
      </StickyFooter>
    </div>
  );
}
