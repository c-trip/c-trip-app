import { useNavigate } from 'react-router'
import { format } from 'date-fns'
import { pt } from 'date-fns/locale/pt'
import { IconMapPin, IconCalendarEvent, IconChevronRight, IconRefresh, IconCash, IconArmchair, IconClock } from '@tabler/icons-react'
import { useOperatorSchedules } from '@/hooks/operator/useOperatorSchedules'
import { useMySales } from '@/hooks/operator/useBoarding'
import { useAuth } from '@/hooks/auth/useAuth'
import type { OperatorSchedule } from '@/types/operator'
import { formatKz } from '@/lib/format'
import { Card, CardContent } from '@/components/ui/card'
import RouteDisplay from '@/components/RouteDisplay'

function greeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Bom dia'
  if (h < 19) return 'Boa tarde'
  return 'Boa noite'
}

function todayLabel(): string {
  const s = format(new Date(), "EEEE, d 'de' MMMM", { locale: pt })
  return s.charAt(0).toUpperCase() + s.slice(1)
}

const STATUS_STYLE: Record<string, { dot: string; badge: string; label: string }> = {
  scheduled: { dot: 'bg-[#1D4ED8]', badge: 'bg-[#EFF6FF] text-[#1D4ED8]', label: 'A iniciar' },
  boarding: { dot: 'bg-[#047857]', badge: 'bg-[#D1FAE5] text-[#047857]', label: 'Embarque' },
  departed: { dot: 'bg-[#6B7280]', badge: 'bg-[#F3F4F6] text-[#6B7280]', label: 'Em rota' },
  cancelled: { dot: 'bg-red-500', badge: 'bg-red-50 text-red-600', label: 'Cancelada' },
}

function statusStyle(status: string) {
  return STATUS_STYLE[status] ?? { dot: 'bg-gray-400', badge: 'bg-[#F3F4F6] text-[#6B7280]', label: status }
}

export default function OperatorDayTrips() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { schedules, isLoading, error, refetch } = useOperatorSchedules()
  const mySales = useMySales()

  const firstName = user?.name?.trim().split(/\s+/)[0]

  const openManifest = (schedule: OperatorSchedule) => {
    navigate(`/operator/manifest?schedule=${schedule.schedule_id}`)
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-outfit">
      <header className="sticky top-0 z-20 border-b border-gray-200 bg-white px-5 pb-4 pt-5">
        <p className="text-[13px] font-medium text-[#6B7280]">
          {greeting()}{firstName ? `, ${firstName}` : ''}
        </p>
        <h1 className="mt-0.5 text-[26px] font-extrabold tracking-tight text-[#111827]">Painel do Dia</h1>
        <div className="mt-2 flex items-center gap-2 text-[12px] text-[#6B7280]">
          <span className="inline-flex items-center gap-1">
            <IconMapPin className="size-3.5 text-[#1B7A3D]" />
            Terminal de Viana
          </span>
          <span className="size-1 rounded-full bg-gray-300" />
          <span className="inline-flex items-center gap-1">
            <IconCalendarEvent className="size-3.5 text-[#1B7A3D]" />
            {todayLabel()}
          </span>
        </div>
      </header>

      <main className="px-5 py-5 pb-28">
        {mySales.data && (
          <div className="mb-6 overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white">
            <div className="flex items-center gap-4 p-4">
              <div className="flex size-12 items-center justify-center rounded-xl bg-[#1B7A3D]/10">
                <IconCash className="size-5 text-[#1B7A3D]" />
              </div>
              <div className="flex-1">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-[#6B7280]">
                  As minhas vendas de hoje
                </p>
                <p className="mt-0.5 text-2xl font-extrabold leading-none text-[#111827]">
                  {formatKz(mySales.data.total)}
                </p>
              </div>
            </div>
            <div className="border-t border-gray-100 bg-gray-50/60 px-4 py-2 text-[12px] text-[#6B7280]">
              {mySales.data.count} {mySales.data.count === 1 ? 'venda registada' : 'vendas registadas'}
            </div>
          </div>
        )}

        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="text-[15px] font-bold text-[#111827]">Partidas de hoje</h2>
          {!isLoading && !error && (
            <span className="text-[13px] font-semibold text-[#1B7A3D]">
              {schedules.length} {schedules.length === 1 ? 'autocarro' : 'autocarros'}
            </span>
          )}
        </div>

        {isLoading && (
          <div className="flex flex-col gap-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-32 animate-pulse rounded-2xl bg-gray-100" />
            ))}
          </div>
        )}

        {!isLoading && error && (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <p className="text-sm text-[#4B5563]">{error}</p>
            <button
              type="button"
              onClick={() => void refetch()}
              className="flex items-center gap-1.5 text-sm font-semibold text-[#1B7A3D]"
            >
              <IconRefresh className="size-4" />
              Tentar novamente
            </button>
          </div>
        )}

        {!isLoading && !error && schedules.length === 0 && (
          <div className="rounded-2xl border border-dashed border-gray-300 py-14 text-center text-sm text-gray-400">
            Não há viagens abertas para hoje.
          </div>
        )}

        {!isLoading && !error && schedules.length > 0 && (
          <div className="flex flex-col gap-3">
            {schedules.map((schedule) => {
              const style = statusStyle(schedule.status)
              return (
                <Card
                  key={schedule.schedule_id}
                  role="button"
                  tabIndex={0}
                  className="group p-0 cursor-pointer border-[#E5E7EB] bg-white transition-all
                  hover:border-[#1B7A3D]/40 hover:shadow-sm active:scale-[0.99]
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B7A3D] focus-visible:ring-offset-2"
                  onClick={() => openManifest(schedule)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      openManifest(schedule)
                    }
                  }}
                >
                  <CardContent className="p-4">
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <RouteDisplay
                        origin={schedule.origin}
                        destination={schedule.destination}
                        className="text-base font-bold text-[#111827]"
                        iconClassName="size-4"
                      />
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${style.badge}`}>
                        <span className={`size-1.5 rounded-full ${style.dot}`} />
                        {style.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-5 text-[13px] text-[#4B5563]">
                      <span className="inline-flex items-center gap-1.5">
                        <IconClock className="size-4 text-gray-400" />
                        <span className="font-semibold text-[#111827]">{schedule.departure_time}</span>
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <IconArmchair className="size-4 text-gray-400" />
                        <span className="font-semibold text-[#111827]">{schedule.available_seats}</span>
                        /{schedule.total_seats} livres
                      </span>
                    </div>

                    <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
                      <span className="text-xs font-semibold text-[#1B7A3D]">Ver manifesto</span>
                      <IconChevronRight className="size-4 text-[#1B7A3D] transition-transform group-hover:translate-x-0.5" />
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
