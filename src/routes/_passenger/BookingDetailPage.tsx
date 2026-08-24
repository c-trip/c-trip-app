import { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { IconArrowLeft, IconCircle , IconAlertTriangle , IconQrcode } from "@tabler/icons-react";
import { gooeyToast } from "goey-toast";
import { getBookingById, updateBookingStatus } from "@/lib/bookings";
import { getScheduleById } from "@/data/mockSeats";
import type { BookingStatus } from "@/types";


 

const STATUS_STYLE: Record<
  BookingStatus,
  { bg: string; text: string; label: string }
> = {
  confirmada: {
    bg: "bg-[#1B7A3D]/10",
    text: "text-[#1B7A3D]",
    label: "Confirmada",
  },
  pendente: {
    bg: "bg-[#F59E0B]/10",
    text: "text-[#F59E0B]",
    label: "Pendente",
  },
  cancelada: { bg: "bg-red-100", text: "text-red-600", label: "Cancelada" },
  concluida: { bg: "bg-blue-100", text: "text-blue-600", label: "Concluída" },
};

export default function BookingDetailPage() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(() => getBookingById(bookingId ?? ""));

  const schedule = useMemo(() => {
    if (!booking) return undefined;
    return getScheduleById(booking.scheduleId);
  }, [booking]);

  const [canCancel] = useState(() => {
    if (!booking || !schedule) return false
    const departureAt = new Date(
      `${schedule.departureDate}T${schedule.departureTime}`,
    ).getTime()
    const canCancelUntil = departureAt - 24 * 60 * 60 * 1000
    return (
      (booking.status === "confirmada" || booking.status === "pendente") &&
      Date.now() <= canCancelUntil
    )
  });

  if (!booking || !schedule) {
    return (
      <div className="min-h-screen bg-gray-50 font-outfit">
        <header className="sticky top-0 z-10 border-b border-gray-200 bg-white px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 transition-colors hover:bg-gray-200"
            >
              <IconArrowLeft className="h-5 w-5 text-gray-700" />
            </button>
            <h1 className="text-lg font-bold text-gray-900">
              Reserva não encontrada
            </h1>
          </div>
        </header>
        <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-20 text-center">
          <p className="max-w-xs text-sm text-gray-500">
            Esta reserva não existe ou foi removida.
          </p>
          <button
            onClick={() => navigate("/bookings")}
            className="h-12 rounded-xl bg-[#1B7A3D] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#15632F]"
          >
            Ver as minhas reservas
          </button>
        </main>
      </div>
    );
  }

  const style = STATUS_STYLE[booking.status];

  const canViewTicket =
    booking.status === "confirmada" || booking.status === "concluida";

  const handleCancel = () => {
    if (!canCancel) return;
    updateBookingStatus(booking.id, "cancelada");
    setBooking({ ...booking, status: "cancelada" });
    gooeyToast.success("Reserva cancelada", {
      description: "A sua reserva foi cancelada com sucesso.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 font-outfit flex flex-col">
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white px-4 py-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 transition-colors 
            hover:bg-gray-200"
          >
            <IconArrowLeft className="h-5 w-5 text-gray-700" />
          </button>
          <div className="flex flex-col">
            <h1 className="text-lg font-bold text-gray-900">
              Detalhe da Reserva
            </h1>
            <p className="text-xs text-[#4B5563] font-semibold">
              Bilhete ID: {booking.id}
            </p>
          </div>
        </div>
      </header>

      <main className="px-5 py-2 flex flex-col gap-4 flex-1 mt-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between mb-4 border-b-2 pb-4 border-[#E5E7EB]">
            <span className="text-[18px] font-bold text-[#111827]">
              {schedule.route}
            </span>
            <span
              className={`text-xs font-semibold px-3 py-1 rounded-full ${style.bg} ${style.text}`}
            >
              {style.label}
            </span>
          </div>

          <div className="flex items-center justify-between mb-4">
            <p className="text-[13px] font-normal text-[#4B5563]">
              Companhia de Transporte{" "}
            </p>
            <p className="text-[13px] text-[#111827] font-bold">
              {schedule.operatorName}
            </p>
          </div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-[13px] font-normal text-[#4B5563]">
              Data da Partida{" "}
            </p>
            <div className="text-[13px] text-[#111827] font-bold flex gap-1">
              <p>{schedule.departureDate},</p>
              <p>{schedule.departureTime}</p>
            </div>
          </div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-[13px] font-normal text-[#4B5563]">
              Lugar de Embarque{" "}
            </p>
            <p className="text-[13px] text-[#111827] font-bold">
              {schedule.boardingPoint}, {schedule.origin}
            </p>
          </div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-[13px] font-normal text-[#4B5563]">
              Lugar Reservado{" "}
            </p>
            <div className="text-[13px] text-[#1B7A3D] font-bold">
              <div className="flex gap-1">
                <p>Lugar {booking.seatLabel}</p>
                <p>({booking.passengerName})</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 bg-white p-4 rounded-2xl border border-[#E5E7EB]">
          <p className="text-[#111827] text-[14px] font-bold">
            Estado da Reserva
          </p>

          {booking.status === 'cancelada' ? (
            <div className="flex items-center gap-2 px-4">
              <IconCircle className="size-3 text-red-500" />
              <div className="flex flex-col">
                <p className="text-[13px] font-semibold text-red-600">Reserva Cancelada</p>
                <p className="text-[11px] text-[#9CA3AF]">Esta reserva foi cancelada</p>
              </div>
            </div>
          ) : booking.status === 'concluida' ? (
            <>
              <div className="flex items-center gap-2 px-4">
                <IconCircle className="size-3 text-[#10B981]" />
                <div className="flex flex-col">
                  <p className="text-[13px] font-semibold">Reservado e Pago</p>
                  <div className="flex text-[11px]">
                    <span>{schedule.departureDate},</span>
                    <span className="ml-1">{schedule.departureTime}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 px-4">
                <IconCircle className="size-3 text-[#10B981]" />
                <div className="flex flex-col">
                  <p className="text-[13px] font-semibold">Embarque Concluído</p>
                  <p className="text-[11px] text-[#10B981]">Concluído</p>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 px-4">
                <IconCircle className="size-3 text-[#10B981]" />
                <div className="flex flex-col">
                  <p className="text-[13px] font-semibold">Reservado e Pago</p>
                  <div className="flex text-[11px]">
                    <span>{schedule.departureDate},</span>
                    <span className="ml-1">{schedule.departureTime}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 px-4">
                <IconCircle className="size-3 text-[#D1D5DB]" />
                <div className="flex flex-col">
                  <p className="text-[13px] font-semibold text-[#4B5563]">Embarque Iniciado</p>
                  <p className="text-[11px] text-[#9CA3AF]">Pendente</p>
                </div>
              </div>
            </>
          )}
        </div>

        {canCancel && (
          <div className="flex place-items-start justify-center bg-[#FEF3C7] p-3
          rounded-xl gap-2 items-center">
            <IconAlertTriangle className="text-[#F59E0B] size-5" />
            <p className="text-[#111827] text-xs font-normal w-[306px]">Cancelamento gratuito disponível até 24h antes da partida com reembolso de 100%</p>
          </div>
        )}
      </main>

      <footer className="sticky bottom-0 flex flex-col items-center gap-3 border-t-2 border-gray-200 bg-white p-5">
        {canViewTicket && (
          <button
            onClick={() =>
              navigate(`/ticket-qr/${booking.scheduleId}?seat=${booking.seat}`)
            }
            className="w-full h-12 rounded-xl text-sm font-semibold
             text-white transition-colors flex gap-2 justify-center items-center hover:opacity-90"
            style={{ background: 'linear-gradient(90deg, #6B9E8C 0%, #3A6356 100%)' }}
          >
            <IconQrcode/>
            Ver Bilhete QR
          </button>
        )}
        {canCancel && (
          <button
            onClick={handleCancel}
            className="w-full h-12 rounded-xl border-2 border-red-300 bg-white text-sm font-semibold 
            text-red-600 transition-colors hover:bg-red-50"
          >
            Cancelar Reserva
          </button>
        )}
      </footer>
    </div>
  );
}


