import { useParams, useNavigate } from 'react-router'
import { IconCircle, IconAlertTriangle, IconQrcode, IconRefresh } from '@tabler/icons-react'
import { gooeyToast } from 'goey-toast'
import { useBooking, useCancelBooking } from '@/hooks/passenger/usePassenger'
import type { BookingApiStatus } from '@/types/passenger'
import StickyFooter from '@/components/StickyFooter'
import GradientButton from '@/components/GradientButton'
import PageHeader from '@/components/PageHeader'

const STATUS_STYLE: Record<string, { bg: string; text: string; label: string }> = {
  confirmed: { bg: 'bg-[#1B7A3D]/10', text: 'text-[#1B7A3D]', label: 'Confirmada' },
  pending: { bg: 'bg-[#F59E0B]/10', text: 'text-[#F59E0B]', label: 'Pendente' },
  cancelled: { bg: 'bg-red-100', text: 'text-red-600', label: 'Cancelada' },
  boarded: { bg: 'bg-blue-100', text: 'text-blue-600', label: 'Embarcado' },
  completed: { bg: 'bg-blue-100', text: 'text-blue-600', label: 'Concluída' },
}

function statusStyle(status: BookingApiStatus) {
  return STATUS_STYLE[status] ?? { bg: 'bg-gray-100', text: 'text-gray-600', label: status }
}

function formatDateTime(iso?: string | null): string {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function formatKz(value: number): string {
  return `${Math.round(value).toLocaleString('pt-PT')} Kz`
}

export default function BookingDetailPage() {
  const { bookingId } = useParams<{ bookingId: string }>()
  const navigate = useNavigate()
  const { data: booking, isLoading, error, refetch } = useBooking(bookingId)
  const { cancel, isLoading: cancelling } = useCancelBooking()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] font-outfit">
        <PageHeader onBack={() => navigate(-1)} title="Detalhe da Reserva" />
        <main className="px-5 py-6 flex flex-col gap-4">
          <div className="h-48 animate-pulse rounded-2xl bg-gray-100" />
          <div className="h-32 animate-pulse rounded-2xl bg-gray-100" />
        </main>
      </div>
    )
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] font-outfit">
        <PageHeader onBack={() => navigate(-1)} title="Reserva não encontrada" />
        <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-20 text-center">
          <p className="max-w-xs text-sm text-gray-500">{error ?? 'Esta reserva não existe.'}</p>
          <button
            onClick={() => (error ? void refetch() : navigate('/bookings'))}
            className="flex items-center gap-1.5 h-12 rounded-xl bg-[#1B7A3D] px-6 text-sm font-semibold text-white hover:bg-[#15632F]"
          >
            {error ? <><IconRefresh className="size-4" /> Tentar novamente</> : 'Ver as minhas reservas'}
          </button>
        </main>
      </div>
    )
  }

  const style = statusStyle(booking.status)
  const canCancel = booking.status === 'confirmed' || booking.status === 'pending'
  const canViewTicket = booking.status === 'confirmed' || booking.status === 'completed' || booking.status === 'boarded'

  const handleCancel = async () => {
    if (!canCancel || !bookingId) return
    const res = await cancel(bookingId)
    if (res) {
      gooeyToast.success('Reserva cancelada')
      void refetch()
    } else {
      gooeyToast.error('Não foi possível cancelar', { description: 'Tente novamente.' })
    }
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-outfit flex flex-col">
      <PageHeader
        onBack={() => navigate(-1)}
        title="Detalhe da Reserva"
        subtitle={<span className="font-semibold text-[#4B5563]">ID: {booking.booking_id.slice(0, 12)}</span>}
      />

      <main className="px-5 py-2 flex flex-col gap-4 flex-1 mt-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between mb-4 border-b-2 pb-4 border-[#E5E7EB]">
            <span className="text-[16px] font-bold text-[#111827]">Reserva {booking.booking_id.slice(0, 8)}</span>
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${style.bg} ${style.text}`}>{style.label}</span>
          </div>

          <div className="flex items-center justify-between mb-4">
            <p className="text-[13px] text-[#4B5563]">Lugar reservado</p>
            <p className="text-[13px] text-[#1B7A3D] font-bold">Lugar {booking.seat_number}</p>
          </div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-[13px] text-[#4B5563]">Valor pago</p>
            <p className="text-[13px] text-[#111827] font-bold">{formatKz(booking.total_price)}</p>
          </div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-[13px] text-[#4B5563]">Data da reserva</p>
            <p className="text-[13px] text-[#111827] font-bold">{formatDateTime(booking.created_at)}</p>
          </div>
          {booking.cancelled_at && (
            <div className="flex items-center justify-between mb-4">
              <p className="text-[13px] text-[#4B5563]">Cancelada em</p>
              <p className="text-[13px] text-red-600 font-bold">{formatDateTime(booking.cancelled_at)}</p>
            </div>
          )}
          {booking.guest_name && (
            <div className="flex items-center justify-between">
              <p className="text-[13px] text-[#4B5563]">Passageiro (balcão)</p>
              <p className="text-[13px] text-[#111827] font-bold">{booking.guest_name}</p>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 bg-white p-4 rounded-2xl border border-[#E5E7EB]">
          <p className="text-[#111827] text-[14px] font-bold">Estado da Reserva</p>
          {booking.status === 'cancelled' ? (
            <div className="flex items-center gap-2 px-4">
              <IconCircle className="size-3 text-red-500" />
              <p className="text-[13px] font-semibold text-red-600">Reserva cancelada</p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 px-4">
                <IconCircle className="size-3 text-[#10B981]" />
                <p className="text-[13px] font-semibold">Reservado{booking.status !== 'pending' ? ' e pago' : ''}</p>
              </div>
              <div className="flex items-center gap-2 px-4">
                <IconCircle className={`size-3 ${booking.status === 'boarded' || booking.status === 'completed' ? 'text-[#10B981]' : 'text-[#D1D5DB]'}`} />
                <p className="text-[13px] font-semibold text-[#4B5563]">
                  Embarque {booking.status === 'boarded' || booking.status === 'completed' ? 'concluído' : 'pendente'}
                </p>
              </div>
            </>
          )}
        </div>

        {canCancel && (
          <div className="flex bg-[#FEF3C7] p-3 rounded-xl gap-2 items-center">
            <IconAlertTriangle className="text-[#F59E0B] size-5 shrink-0" />
            <p className="text-[#111827] text-xs">O cancelamento só é possível antes do embarque.</p>
          </div>
        )}
      </main>

      <StickyFooter>
        {canViewTicket && (
          <GradientButton onClick={() => navigate(`/ticket-qr/${booking.schedule_id}?seat=${booking.seat_number}`)}>
            <IconQrcode />
            Ver Bilhete QR
          </GradientButton>
        )}
        {canCancel && (
          <button
            onClick={handleCancel}
            disabled={cancelling}
            className="w-full h-12 rounded-xl border-2 border-red-300 bg-white text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
          >
            {cancelling ? 'A cancelar...' : 'Cancelar Reserva'}
          </button>
        )}
      </StickyFooter>
    </div>
  )
}
