import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { IconArmchair, IconClock, IconChevronRight, IconTicket, IconRefresh } from '@tabler/icons-react'
import { useBookings } from '@/hooks/passenger/usePassenger'
import { Card, CardContent } from '@/components/ui/card'
import type { BookingApiStatus } from '@/types/passenger'
import PageHeader from '@/components/PageHeader'

const TABS = [
  { value: 'ativas', label: 'Activas' },
  { value: 'historico', label: 'Histórico' },
] as const

type TabValue = (typeof TABS)[number]['value']

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

const isActive = (s: BookingApiStatus) => s === 'confirmed' || s === 'pending'

function formatDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' })
}

function formatKz(value: number): string {
  return `${Math.round(value).toLocaleString('pt-PT')} Kz`
}

export default function BookingsPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<TabValue>('ativas')
  const { data, isLoading, error, refetch } = useBookings()

  const filtered = useMemo(
    () => (data ?? []).filter((b) => (activeTab === 'ativas' ? isActive(b.status) : !isActive(b.status))),
    [data, activeTab],
  )

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-outfit">
      <PageHeader title="Minhas Reservas" className="px-4 pt-4 pb-0">
        <div className="flex gap-6 px-1">
          {TABS.map((tab) => {
            const on = activeTab === tab.value
            return (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                aria-pressed={on}
                className={`relative pb-3 text-sm font-semibold transition-colors ${on ? 'text-[#1B7A3D]' : 'text-gray-400'}`}
              >
                {tab.label}
                {on && <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-[#1B7A3D]" />}
              </button>
            )
          })}
        </div>
      </PageHeader>

      <main className="px-5 py-8 pb-28">
        {isLoading && (
          <div className="flex flex-col gap-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-28 animate-pulse rounded-2xl bg-gray-100" />
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

        {!isLoading && !error && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <IconTicket className="h-8 w-8 text-gray-400" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Nenhuma reserva</h2>
            <p className="mt-1 text-sm text-gray-500">
              {activeTab === 'ativas' ? 'Não tem reservas activas.' : 'Sem reservas no histórico.'}
            </p>
          </div>
        )}

        {!isLoading && !error && filtered.length > 0 && (
          <div className="flex flex-col gap-4">
            {filtered.map((booking) => {
              const style = statusStyle(booking.status)
              return (
                <Card
                  key={booking.booking_id}
                  className="p-0 cursor-pointer hover:scale-[1.01] border-[#E5E7EB] active:scale-[0.99] transition-transform"
                  onClick={() => navigate(`/bookings/${booking.booking_id}`)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-bold text-[#111827]">Reserva {booking.booking_id.slice(0, 8)}</span>
                      <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${style.bg} ${style.text}`}>
                        {style.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center gap-1">
                        <IconArmchair className="size-4 text-[#4B5563]" />
                        <p className="text-xs text-[#4B5563]">Lugar {booking.seat_number}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <IconClock className="size-4 text-[#4B5563]" />
                        <p className="text-xs text-[#4B5563]">{formatDate(booking.created_at)}</p>
                      </div>
                      <p className="text-xs font-bold text-[#111827] ml-auto">{formatKz(booking.total_price)}</p>
                    </div>

                    <div className="flex items-center justify-between border-t-2 border-[#E5E7EB] pt-2">
                      <p className="text-xs text-[#1B7A3D] font-semibold">Ver detalhes</p>
                      <IconChevronRight className="size-4 text-[#1B7A3D]" />
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
