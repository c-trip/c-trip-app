import { useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import {
  IconArrowLeft,
  IconBus,
  IconUser,
  IconId,
  IconPhone,
  IconClock,
  IconArmchair,
  IconCoin,
  IconReceipt,
} from '@tabler/icons-react'
import { gooeyToast } from 'goey-toast'
import { getBookingById, updateBookingStatus } from '@/lib/bookings'
import { getScheduleById } from '@/data/mockSeats'
import type { BookingStatus } from '@/types'

function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-')
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
  return `${d} ${months[parseInt(m, 10) - 1]} ${y}`
}

const STATUS_STYLE: Record<BookingStatus, { bg: string; text: string; label: string }> = {
  confirmada: { bg: 'bg-[#1B7A3D]/10', text: 'text-[#1B7A3D]', label: 'Confirmada' },
  pendente: { bg: 'bg-[#F59E0B]/10', text: 'text-[#F59E0B]', label: 'Pendente' },
  cancelada: { bg: 'bg-red-100', text: 'text-red-600', label: 'Cancelada' },
  concluida: { bg: 'bg-blue-100', text: 'text-blue-600', label: 'Concluída' },
}

export default function BookingDetailPage() {
  const { bookingId } = useParams<{ bookingId: string }>()
  const navigate = useNavigate()
  const [booking, setBooking] = useState(() => getBookingById(bookingId ?? ''))

  const schedule = useMemo(() => {
    if (!booking) return undefined
    return getScheduleById(booking.scheduleId)
  }, [booking])

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
            <h1 className="text-lg font-bold text-gray-900">Reserva não encontrada</h1>
          </div>
        </header>
        <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-20 text-center">
          <p className="max-w-xs text-sm text-gray-500">
            Esta reserva não existe ou foi removida.
          </p>
          <button
            onClick={() => navigate('/bookings')}
            className="h-12 rounded-xl bg-[#1B7A3D] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#15632F]"
          >
            Ver as minhas reservas
          </button>
        </main>
      </div>
    )
  }

  const style = STATUS_STYLE[booking.status]
  const canCancel = booking.status === 'confirmada' || booking.status === 'pendente'
  const canViewTicket = booking.status === 'confirmada' || booking.status === 'concluida'

  const handleCancel = () => {
    updateBookingStatus(booking.id, 'cancelada')
    setBooking({ ...booking, status: 'cancelada' })
    gooeyToast.success('Reserva cancelada', { description: 'A sua reserva foi cancelada com sucesso.' })
  }

  return (
    <div className="min-h-screen bg-gray-50 font-outfit flex flex-col">
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white px-4 py-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 transition-colors hover:bg-gray-200"
          >
            <IconArrowLeft className="h-5 w-5 text-gray-700" />
          </button>
          <h1 className="text-lg font-bold text-gray-900">Detalhe da Reserva</h1>
        </div>
      </header>

      <main className="px-5 py-5 flex flex-col gap-4 flex-1">
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-base font-bold text-[#111827]">{schedule.operatorName}</span>
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${style.bg} ${style.text}`}>
              {style.label}
            </span>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-gradient-start/10">
              <IconBus className="h-6 w-6 text-green-gradient-end" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#111827]">{schedule.route}</p>
              <p className="text-xs text-gray-400">{schedule.vehicleType}</p>
            </div>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-lg font-bold text-[#111827]">{schedule.departureTime}</p>
              <p className="text-[10px] text-gray-400">{formatDate(schedule.departureDate)}</p>
            </div>
            <div className="flex flex-col items-center gap-1">
              <p className="text-[10px] text-gray-400">{schedule.duration}</p>
              <div className="h-0.5 w-16 bg-gray-200" />
            </div>
            <div>
              <p className="text-lg font-bold text-[#111827]">{schedule.arrivalTime}</p>
              <p className="text-[10px] text-gray-400">Chegada</p>
            </div>
          </div>

          <div className="border-t border-dashed border-gray-200 pt-4 space-y-3">
            <DetailRow icon={<IconBus className="h-4 w-4" />} label="Viatura" value={`${schedule.busModel} · ${schedule.busPlate}`} />
            <DetailRow icon={<IconUser className="h-4 w-4" />} label="Motorista" value={schedule.driverName} />
            <DetailRow icon={<IconArmchair className="h-4 w-4" />} label="Lugar" value={`${booking.seatLabel} · ${schedule.vehicleType}`} />
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <h2 className="text-sm font-bold text-gray-900 mb-3">Dados do Passageiro</h2>
          <div className="space-y-3">
            <DetailRow icon={<IconUser className="h-4 w-4" />} label="Nome" value={booking.passengerName} />
            <DetailRow icon={<IconId className="h-4 w-4" />} label="BI / Passaporte" value={booking.passengerBI} />
            <DetailRow icon={<IconPhone className="h-4 w-4" />} label="Telefone" value={booking.passengerPhone} />
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <h2 className="text-sm font-bold text-gray-900 mb-3">Pagamento</h2>
          <div className="space-y-3">
            <DetailRow icon={<IconCoin className="h-4 w-4" />} label="Método" value={booking.paymentMethod.toUpperCase()} />
            <DetailRow icon={<IconReceipt className="h-4 w-4" />} label="Referência" value={booking.id} />
            <DetailRow icon={<IconClock className="h-4 w-4" />} label="Criado em" value={new Date(booking.createdAt).toLocaleString('pt-BR')} />
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
            <span className="text-sm text-gray-500">Total</span>
            <span className="text-xl font-extrabold text-[#1B7A3D]">{booking.price}</span>
          </div>
        </div>
      </main>

      <footer className="sticky bottom-0 flex items-center gap-3 border-t-2 border-gray-200 bg-white p-5">
        {canViewTicket && (
          <button
            onClick={() => navigate(`/ticket-qr/${booking.scheduleId}?seat=${booking.seat}`)}
            className="flex-1 h-12 rounded-xl bg-[#1B7A3D] text-sm font-semibold text-white transition-colors hover:bg-[#15632F]"
          >
            Ver Bilhete
          </button>
        )}
        {canCancel && (
          <button
            onClick={handleCancel}
            className="flex-1 h-12 rounded-xl border-2 border-red-300 bg-white text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
          >
            Cancelar Reserva
          </button>
        )}
      </footer>
    </div>
  )
}

function DetailRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
        {icon}
      </div>
      <div className="flex flex-col">
        <p className="text-[10px] text-gray-400">{label}</p>
        <p className="text-xs font-medium text-[#111827]">{value}</p>
      </div>
    </div>
  )
}
