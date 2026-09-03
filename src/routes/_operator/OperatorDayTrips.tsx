import { useNavigate } from 'react-router'
import { IconMapPin, IconClock, IconChevronRight, IconRefresh, IconCash } from '@tabler/icons-react'
import { useOperatorSchedules } from '@/hooks/operator/useOperatorSchedules'
import { useMySales } from '@/hooks/operator/useBoarding'
import { useAuth } from '@/hooks/auth/useAuth'
import type { OperatorSchedule } from '@/types/operator'
import { formatKz } from '@/lib/format'
import { Card, CardContent } from '@/components/ui/card'
import RouteDisplay from '@/components/RouteDisplay'

function formatToday(): string {
  const now = new Date()
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
  return `hoje, ${now.getDate()} ${months[now.getMonth()]}`
}

function greeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Bom dia'
  if (h < 19) return 'Boa tarde'
  return 'Boa noite'
}

const STATUS_STYLE: Record<string, { bg: string; text: string; label: string }> = {
  scheduled: { bg: 'bg-[#EFF6FF]', text: 'text-[#1D4ED8]', label: 'A iniciar' },
  boarding: { bg: 'bg-[#D1FAE5]', text: 'text-[#047857]', label: 'Embarque' },
  departed: { bg: 'bg-[#F3F4F6]', text: 'text-[#6B7280]', label: 'Em rota' },
  cancelled: { bg: 'bg-red-100', text: 'text-red-600', label: 'Cancelada' },
}

function statusStyle(status: string) {
  return STATUS_STYLE[status] ?? { bg: 'bg-[#F3F4F6]', text: 'text-[#6B7280]', label: status }
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
      <header className="relative overflow-hidden rounded-b-3xl px-5 pt-10 pb-6 min-h-[200px]">
        {/* fundo sofisticado: base verde profunda + brilho suave + halos desfocados */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(165deg, #1B7A3D 0%, #0E3D20 100%)' }}
        />
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(120% 80% at 88% -10%, rgba(74,222,128,0.35), transparent 60%)' }}
        />
        <div className="pointer-events-none absolute -right-16 -top-24 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-emerald-300/15 blur-3xl" />

        <div className="relative flex flex-col gap-2 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <IconMapPin className="size-4" />
              <span className="text-[13px] font-semibold">Terminal de Viana</span>
            </div>
            <div className="flex items-center justify-center gap-1 rounded-full border border-white/15 bg-white/15 px-2.5 py-1.5 backdrop-blur-sm">
              <IconClock className="size-3" />
              <span className="text-xs font-semibold opacity-90">{formatToday()}</span>
            </div>
          </div>

          <div className="mt-3">
            <p className="text-sm font-medium text-white/75">
              {greeting()}{firstName ? `, ${firstName}` : ''}
            </p>
            <h1 className="text-[32px] font-extrabold leading-tight">Painel do Dia</h1>
            <div className="mt-1 flex items-end justify-between gap-3">
              <span className="text-sm text-white/70 whitespace-nowrap">Visão geral das viagens de hoje</span>
              <div className="h-px w-[100px] bg-white/40" />
            </div>
          </div>
        </div>
      </header>

      <main className="px-5 py-6 pb-28">
        {mySales.data && (
          <div className="-mt-12 mb-6 flex items-center gap-3 rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-sm">
            <div className="flex size-11 items-center justify-center rounded-full bg-[#1B7A3D]/10 shrink-0">
              <IconCash className="size-5 text-[#1B7A3D]" />
            </div>
            <div className="flex-1">
              <p className="text-[11px] font-medium text-[#4B5563] uppercase tracking-wide">As minhas vendas de hoje</p>
              <p className="text-lg font-extrabold text-[#111827]">
                {formatKz(mySales.data.total)}
                <span className="ml-2 text-xs font-medium text-gray-400">
                  {mySales.data.count} {mySales.data.count === 1 ? 'venda' : 'vendas'}
                </span>
              </p>
            </div>
          </div>
        )}

        <div className='flex items-center justify-between'>
          <h2 className="text-[15px] font-bold text-[#111827] mb-4">Partidas de Hoje</h2>
          {!isLoading && !error && (
            <p className='text-[13px] text-[#1B7A3D] font-semibold'>{schedules.length} Autocarros</p>
          )}
        </div>

        {isLoading && (
          <div className="flex flex-col gap-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-32 animate-pulse rounded-xl bg-gray-100" />
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
          <div className="text-center py-16 text-gray-400 text-sm">
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
                  className="p-0 cursor-pointer bg-white hover:scale-[1.01] border-[#E5E7EB]
                  active:scale-[0.99] transition-transform focus-visible:outline-none
                  focus-visible:ring-2 focus-visible:ring-[#1B7A3D] focus-visible:ring-offset-2"
                  onClick={() => openManifest(schedule)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      openManifest(schedule)
                    }
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <RouteDisplay
                        origin={schedule.origin}
                        destination={schedule.destination}
                        className="text-base font-bold text-[#111827]"
                        iconClassName="size-5"
                      />
                      <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${style.bg} ${style.text}`}>
                        {style.label}
                      </span>
                    </div>
                    <div className='flex items-center gap-6 mb-2'>
                      <div className='flex flex-col'>
                        <span className='text-[11px] text-[#4B5563] font-medium'>Hora</span>
                        <p className='text-[14px] text-[#111827] font-bold'>{schedule.departure_time}</p>
                      </div>
                      <div className='flex flex-col'>
                        <span className='text-[11px] text-[#4B5563] font-medium'>Lugares</span>
                        <p className='text-[14px] font-bold text-[#111827]'>
                          {schedule.available_seats}/{schedule.total_seats} disponíveis
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-[#E5E7EB] pt-1">
                      <p className='font-semibold text-xs text-[#1B7A3D]'>Ver Manifesto do Passageiro</p>
                      <IconChevronRight className="size-5 text-[#1B7A3D]" />
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
