import { useMemo } from 'react'
import { useNavigate } from 'react-router'
import { IconQrcode, IconBus, IconClock, IconTicket } from '@tabler/icons-react'
import { getBookings } from '@/lib/bookings'
import { getScheduleById } from '@/data/mockSeats'
import { Card, CardContent } from '@/components/ui/card'
import type { BookingStatus } from '@/types'
import RouteDisplay from '@/components/RouteDisplay'
import PageHeader from '@/components/PageHeader'

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

export default function TicketsPage() {
  const navigate = useNavigate()

  const tickets = useMemo(() => {
    return getBookings().filter(
      (b) => b.status === 'confirmada' || b.status === 'concluida'
    )
  }, [])

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-outfit">
      <PageHeader title="Os Meus Bilhetes" />

      <main className="px-5 py-6 pb-28">
        {tickets.length > 0 ? (
          <div className="flex flex-col gap-4">
            {tickets.map((ticket) => {
              const schedule = getScheduleById(ticket.scheduleId)
              const style = STATUS_STYLE[ticket.status]
              return (
                <Card
                  key={ticket.id}
                  role="button"
                  tabIndex={0}
                  className="p-0 cursor-pointer hover:scale-[1.01] border-[#E5E7EB] active:scale-[0.99] transition-transform"
                  onClick={() => navigate(`/ticket-qr/${ticket.scheduleId}?seat=${ticket.seat}`)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      navigate(`/ticket-qr/${ticket.scheduleId}?seat=${ticket.seat}`)
                    }
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-base font-bold text-[#111827]">
                        {schedule ? (
                          <RouteDisplay origin={schedule.origin} destination={schedule.destination} />
                        ) : (
                          'Rota'
                        )}
                      </span>
                      <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${style.bg} ${style.text}`}>
                        {style.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 mb-2">
                      <IconBus className="size-4 text-[#4B5563]" />
                      <p className="text-xs font-normal text-[#4B5563]">
                        {schedule?.operatorName ?? 'Operador'}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 mb-3">
                      <IconClock className="size-4 text-[#4B5563]" />
                      <div className="text-[10px] text-[#4B5563] flex gap-1">
                        <p>{schedule ? formatDate(schedule.departureDate) : '--'}</p>
                        <p>Às</p>
                        <p>{schedule?.departureTime ?? '--:--'}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t-2 border-[#E5E7EB] pt-3">
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="text-[10px] text-gray-400 font-medium">Lugar</p>
                          <p className="text-sm font-bold text-[#111827]">{ticket.seat}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-400 font-medium">Preço</p>
                          <p className="text-sm font-bold text-[#111827]">
                            {ticket.price}
                          </p>
                        </div>
                      </div>

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
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <IconTicket className="h-8 w-8 text-gray-400" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Nenhum bilhete encontrado</h2>
            <p className="mt-1 text-sm text-gray-500">
              Os seus bilhetes confirmados aparecem aqui.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
