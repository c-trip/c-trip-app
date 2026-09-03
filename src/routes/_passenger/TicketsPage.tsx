import { useMemo } from 'react'
import { useNavigate } from 'react-router'
import { IconQrcode, IconArmchair, IconClock, IconTicket, IconRefresh } from '@tabler/icons-react'
import { useBookings } from '@/hooks/passenger/usePassenger'
import { Card, CardContent } from '@/components/ui/card'
import type { BookingApiStatus } from '@/types/passenger'
import PageHeader from '@/components/PageHeader'

const STATUS_STYLE: Record<string, { bg: string; text: string; label: string }> = {
  confirmed: { bg: 'bg-[#1B7A3D]/10', text: 'text-[#1B7A3D]', label: 'Confirmada' },
  boarded: { bg: 'bg-blue-100', text: 'text-blue-600', label: 'Embarcado' },
  completed: { bg: 'bg-blue-100', text: 'text-blue-600', label: 'Concluída' },
}

const hasTicket = (s: BookingApiStatus) => s === 'confirmed' || s === 'boarded' || s === 'completed'

function formatDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' })
}

function formatKz(value: number): string {
  return `${Math.round(value).toLocaleString('pt-PT')} Kz`
}

export default function TicketsPage() {
  const navigate = useNavigate()
  const { data, isLoading, error, refetch } = useBookings()

  const tickets = useMemo(() => (data ?? []).filter((b) => hasTicket(b.status)), [data])

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-outfit">
      <PageHeader title="Os Meus Bilhetes" />

      <main className="px-5 py-6 pb-28">
        {isLoading && (
          <div className="flex flex-col gap-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-32 animate-pulse rounded-2xl bg-gray-100" />
            ))}
          </div>
        )}

        {!isLoading && error && (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <p className="text-sm text-[#4B5563]">{error}</p>
            <button type="button" onClick={() => void refetch()} className="flex items-center gap-1.5 text-sm font-semibold text-[#1B7A3D]">
              <IconRefresh className="size-4" />
              Tentar novamente
            </button>
          </div>
        )}

        {!isLoading && !error && tickets.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <IconTicket className="h-8 w-8 text-gray-400" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Nenhum bilhete</h2>
            <p className="mt-1 text-sm text-gray-500">Os seus bilhetes confirmados aparecem aqui.</p>
          </div>
        )}

        {!isLoading && !error && tickets.length > 0 && (
          <div className="flex flex-col gap-4">
            {tickets.map((ticket) => {
              const style = STATUS_STYLE[ticket.status] ?? STATUS_STYLE.confirmed
              return (
                <Card
                  key={ticket.booking_id}
                  role="button"
                  tabIndex={0}
                  className="p-0 cursor-pointer hover:scale-[1.01] border-[#E5E7EB] active:scale-[0.99] transition-transform"
                  onClick={() => navigate(`/ticket-qr/${ticket.schedule_id}?seat=${ticket.seat_number}`)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      navigate(`/ticket-qr/${ticket.schedule_id}?seat=${ticket.seat_number}`)
                    }
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-bold text-[#111827]">Reserva {ticket.booking_id.slice(0, 8)}</span>
                      <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${style.bg} ${style.text}`}>
                        {style.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center gap-1">
                        <IconArmchair className="size-4 text-[#4B5563]" />
                        <p className="text-xs text-[#4B5563]">Lugar {ticket.seat_number}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <IconClock className="size-4 text-[#4B5563]" />
                        <p className="text-xs text-[#4B5563]">{formatDate(ticket.created_at)}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t-2 border-[#E5E7EB] pt-3">
                      <p className="text-sm font-bold text-[#111827]">{formatKz(ticket.total_price)}</p>
                      <div className="flex items-center gap-1.5 text-[#1B7A3D]">
                        <IconQrcode className="size-4" />
                        <span className="text-xs font-semibold">Ver QR</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
