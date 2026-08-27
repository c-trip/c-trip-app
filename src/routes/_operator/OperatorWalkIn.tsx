import { useState } from "react";
import { useNavigate } from "react-router";
import {
  IconArrowLeft,
  IconBus,
  IconUser,
  IconId,
  IconCheck,
  IconChevronDown,
} from "@tabler/icons-react";
import { gooeyToast } from "goey-toast";
import { getOperatorTodaySchedules } from "@/data/mockOperatorSchedules";
import type { OperatorSchedule } from "@/data/mockOperatorSchedules";
import { getSeatMapBySchedule } from "@/data/mockSeats";
import { readActiveHeldSeats } from "@/lib/seatHolds";

type SeatStatus = "available" | "occupied" | "reserved" | "held";

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
      <button
        type="button"
        onClick={onClick}
        aria-label={`Lugar ${label} ocupado`}
        className={`${base} text-[#9CA3AF] bg-[#F3F4F6] cursor-not-allowed`}
      >
        {label}
      </button>
    );
  }

  if (status === "reserved") {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={`Lugar ${label} reservado`}
        className={`${base} text-white bg-[#F59E0B] cursor-not-allowed`}
      >
        {label}
      </button>
    );
  }

  if (status === "held") {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={`Lugar ${label} em retenção`}
        className={`${base} text-white bg-[#C2410C] cursor-not-allowed`}
      >
        {label}
      </button>
    );
  }

  if (selected) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-pressed
        className={`${base} text-white bg-[#15632F] scale-110 ring-2 ring-white shadow-lg`}
      >
        {label}
      </button>
    );
  }

  if (dimmed) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`${base} text-white bg-[#1B7A3D] opacity-40 hover:opacity-100`}
      >
        {label}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${base} text-white bg-[#1B7A3D] hover:scale-105`}
    >
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

const EMPTY_FORM: WalkInForm = {
  name: "",
  phone: "",
  idDoc: "",
  seatNumber: "",
};

export default function OperatorWalkIn() {
  const navigate = useNavigate();
  const schedules = getOperatorTodaySchedules().filter(
    (s) => s.status !== "departed",
  );
  const [selectedSchedule, setSelectedSchedule] =
    useState<OperatorSchedule | null>(null);
  const [showSchedulePicker, setShowSchedulePicker] = useState(false);
  const [form, setForm] = useState<WalkInForm>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const setField = (field: keyof WalkInForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const seatMap = selectedSchedule
    ? getSeatMapBySchedule(selectedSchedule.id)
    : undefined;
  const heldSeats = selectedSchedule
    ? readActiveHeldSeats(selectedSchedule.id)
    : [];
  const occupiedSet = new Set(seatMap?.occupied ?? []);
  const reservedSet = new Set(seatMap?.reserved ?? []);
  const heldSet = new Set(heldSeats);

  const renumberSeats = (seat: number): SeatStatus => {
    if (occupiedSet.has(seat)) return "occupied";
    if (reservedSet.has(seat)) return "reserved";
    if (heldSet.has(seat)) return "held";
    return "available";
  };

  const seatLabel = (seat: number) => String(seat).padStart(2, "0");

  const handleSeatClick = (seat: number) => {
    const label = seatLabel(seat);
    const status = renumberSeats(seat);
    if (status === "occupied") {
      gooeyToast.error("Lugar ocupado", {
        description: `O lugar ${label} já está ocupado.`,
      });
      return;
    }
    if (status === "reserved") {
      gooeyToast.warning("Lugar reservado", {
        description: `O lugar ${label} já está reservado.`,
      });
      return;
    }
    if (status === "held") {
      gooeyToast.warning("Lugar em retenção", {
        description: `O lugar ${label} está temporariamente retido.`,
      });
      return;
    }
    const current = Number(form.seatNumber);
    setField("seatNumber", current === seat ? "" : String(seat));
  };

  const seatNumber = Number(form.seatNumber);
  const selectedSeat =
    Number.isInteger(seatNumber) && seatNumber >= 1
      ? String(seatNumber).padStart(2, "0")
      : null;
  const isValid =
    form.name.trim().length >= 2 &&
    selectedSchedule !== null &&
    selectedSchedule.availableSeats > 0 &&
    Number.isInteger(seatNumber) &&
    seatNumber >= 1 &&
    seatNumber <= selectedSchedule.totalSeats;

  const handleSubmit = async () => {
    if (!isValid || submitting) return;
    setSubmitting(true);

    try {
      // Mock — substituir por POST /boarding/operator/sell
      await new Promise((r) => setTimeout(r, 1500));

      gooeyToast.success("Bilhete vendido", {
        description: `${form.name.trim()} — Lugar ${form.seatNumber.trim()}`,
      });
      setSuccess(true);
    } catch {
      gooeyToast.error("Erro ao vender", {
        description: "Tente novamente.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setForm(EMPTY_FORM);
    setSuccess(false);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 font-outfit">
        <header className="sticky top-0 z-50 bg-gray-50 px-5 pt-3 pb-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate("/operator")}
              aria-label="Voltar ao painel"
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <IconArrowLeft className="size-5 text-gray-600" />
            </button>
            <h1 className="text-[22px] font-bold text-[#111827] text-center flex-1">
              Venda ao Balcão
            </h1>
          </div>
        </header>

        <main className="px-5 py-12 flex flex-col items-center gap-6">
          <div className="size-20 rounded-full bg-[#1B7A3D] flex items-center justify-center animate-scale-in">
            <IconCheck className="size-10 text-white" strokeWidth={3} />
          </div>
          <div className="text-center">
            <p className="text-[#111827] font-bold text-lg">
              Bilhete Vendido com Sucesso
            </p>
            <p className="text-gray-500 text-sm mt-1">
              {form.name.trim()} — Lugar {form.seatNumber.trim()}
            </p>
            {selectedSchedule && (
              <p className="text-gray-400 text-xs mt-1">
                {selectedSchedule.route} · {selectedSchedule.departureTime}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-3 w-full max-w-xs">
            <button
              type="button"
              onClick={handleReset}
              className="w-full py-3 bg-[#1B7A3D] text-white font-semibold rounded-xl hover:bg-[#15632F] transition-colors"
            >
              Nova Venda
            </button>
            <button
              type="button"
              onClick={() => navigate("/operator")}
              className="w-full py-3 bg-white text-[#111827] border border-gray-200 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
            >
              Voltar ao Painel
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-outfit">

      <header className="sticky top-0 z-50 bg-gray-50 px-5 pt-3 pb-4 border-b border-gray-200">
        <div className="flex justify-baseline gap-2">
          <button
            type="button"
            onClick={() => navigate("/operator")}
            aria-label="Voltar ao painel"
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <IconArrowLeft className="size-5 text-[#111827]" />
          </button>
          <div className="flex flex-col">
            <h1 className="text-[22px] font-bold text-[#111827] ">
              Venda ao Balcão
            </h1>
            <span className="text-[13px] text-[#4B5563] font-normal">
              Emissão de Bilhete Local (Balcão)
            </span>
          </div>
        </div>
      </header>

      <main className="px-5 py-5 pb-44">
        <section className="mb-6">
          <label className="block text-xs font-bold text-[#6B7280] uppercase tracking-wide mb-2">
            Viagem
          </label>
          <button
            type="button"
            onClick={() => setShowSchedulePicker(!showSchedulePicker)}
            className="w-full flex items-center justify-between p-3.5 bg-white border
             border-gray-200 rounded-xl text-left hover:border-[#1B7A3D] transition-colors"
          >
            {selectedSchedule ? (
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-full bg-[#1B7A3D]/10 flex items-center justify-center 
                shrink-0">
                  <IconBus className="size-4 text-[#1B7A3D]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#111827]">
                    {selectedSchedule.route} ({selectedSchedule.operatorName })
                  </p>
                  <p className="text-[11px] text-gray-500">
                    {selectedSchedule.departureTime} ·{" "}
                    {selectedSchedule.busPlate} ·{" "}
                    {selectedSchedule.availableSeats} lugares
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                  <IconBus className="size-4 text-gray-400" />
                </div>
                <span className="text-sm text-gray-400">
                  Selecionar viagem...
                </span>
              </div>
            )}
            <IconChevronDown
              className={`size-5 text-gray-400 transition-transform ${showSchedulePicker ? "rotate-180" : ""}`}
            />
          </button>

          {showSchedulePicker && (
            <div className="mt-2 bg-white border border-gray-200 rounded-xl overflow-hidden">
              {schedules
                .filter((s) => s.availableSeats > 0)
                .map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      setSelectedSchedule(s);
                      setShowSchedulePicker(false);
                    }}
                    className={`w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                      selectedSchedule?.id === s.id ? "bg-[#1B7A3D]/5" : ""
                    }`}
                  >
                    <div className="size-9 rounded-full bg-[#1B7A3D]/10 flex items-center justify-center shrink-0">
                      <IconBus className="size-4 text-[#1B7A3D]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-[#111827]">
                        {s.route}
                      </p>
                      <p className="text-[11px] text-gray-500">
                        {s.departureTime} · {s.busPlate}
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-[#1B7A3D]">
                      {s.availableSeats} disp.
                    </span>
                  </button>
                ))}
            </div>
          )}
        </section>

        <section className="flex flex-col gap-2 mb-6">
          <p className="text-sm text-[#111827] font-bold">Selecione o Lugar</p>
          {selectedSchedule && seatMap ? (
            <>
              <div className="border border-[#E5E7EB] bg-white rounded-xl p-3 grid grid-cols-5 gap-2 justify-items-center">
                {Array.from({ length: seatMap.totalSeats }, (_, i) => i + 1).map(
                  (seat) => (
                    <SeatButton
                      key={seat}
                      label={seatLabel(seat)}
                      status={renumberSeats(seat)}
                      selected={selectedSeat === seatLabel(seat)}
                      dimmed={
                        selectedSeat !== null &&
                        seatLabel(seat) !== selectedSeat &&
                        renumberSeats(seat) === "available"
                      }
                      onClick={() => handleSeatClick(seat)}
                    />
                  ),
                )}
              </div>
              <div className="flex justify-center gap-5 text-[10px] text-gray-500 flex-wrap">
                <span className="flex items-center gap-1">
                  <div className="size-3 rounded bg-[#1B7A3D]" />
                  Livre
                </span>
                <span className="flex items-center gap-1">
                  <div className="size-3 rounded bg-[#F59E0B]" />
                  Reservado
                </span>
                <span className="flex items-center gap-1">
                  <div className="size-3 rounded bg-[#C2410C]" />
                  Retido
                </span>
                <span className="flex items-center gap-1">
                  <div className="size-3 rounded bg-[#F3F4F6]" />
                  Ocupado
                </span>
              </div>
            </>
          ) : (
            <div className="border border-[#E5E7EB] bg-white h-28 rounded-xl p-3 flex items-center justify-center">
              <p className="text-sm text-gray-400">
                Selecionar viagem para ver os lugares
              </p>
            </div>
          )}
        </section>

        <section className="space-y-4">
          <h2 className="text-xs font-bold text-[#6B7280] uppercase tracking-wide">
            Dados do Passageiro
          </h2>

          <div>
            <label
              htmlFor="walkin-name"
              className="block text-xs font-bold text-[#6B7280] uppercase tracking-wide mb-2"
            >
              Nome completo
            </label>
            <div className="relative">
              <IconUser className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                id="walkin-name"
                type="text"
                value={form.name}
                onChange={(e) => setField("name", e.target.value)}
                placeholder="Nome completo"
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-outfit placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1B7A3D]/30 focus:border-[#1B7A3D]"
              />
            </div>
          </div>



          <div>
            <label
              htmlFor="walkin-idoc"
              className="block text-xs font-bold text-[#6B7280] uppercase tracking-wide mb-2"
            >
              Documento de identificação
            </label>
            <div className="relative">
              <IconId className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                id="walkin-idoc"
                type="text"
                value={form.idDoc}
                onChange={(e) => setField("idDoc", e.target.value)}
                placeholder="Digite o número do seu BI"
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 
                rounded-xl text-sm font-outfit placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1B7A3D]/30 focus:border-[#1B7A3D]"
              />
            </div>
          </div>


        </section>
      </main>

      <footer className="fixed bottom-20 left-0 right-0 z-50 flex flex-col gap-4 p-6 bg-white border-t border-gray-200">
        <div className="flex justify-between gap-1 items-center">
          <div>
            <p className="text-xs text-[#4B5563] font-normal">Valor a Pagar</p>
            <p className="text-[11px] text-gray-400">Multicaixa / Cash</p>
          </div>
          <p className="text-[#1B7A3D] text-[22px] font-extrabold font-outfit">
            {selectedSchedule ? selectedSchedule.price : "—"}
          </p>
        </div>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!isValid || submitting}
          className="w-full py-3.5 bg-[#1B7A3D] text-white font-semibold rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#15632F] active:scale-[0.98]"
        >
          {submitting ? (
            <span className="flex items-center justify-center gap-2">
              <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              A processar...
            </span>
          ) : (
            "Confirmar Venda"
          )}
        </button>
      </footer>
    </div>
  );
}
