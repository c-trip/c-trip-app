import { useMemo, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router'
import { IconArrowLeft, IconSearch, IconX, IconCheck, IconClock, IconRefresh } from '@tabler/icons-react'
import type { ComponentType } from 'react'
import { useManifest } from '@/hooks/operator/useManifest'
import { useOperatorSchedules } from '@/hooks/operator/useOperatorSchedules'
import type { ManifestItem } from '@/types/operator'
import { Card, CardContent } from '@/components/ui/card'
import RouteDisplay from '@/components/RouteDisplay'

function seatLabel(seat: number): string {
  const row = Math.ceil(seat / 4)
  const col = ((seat - 1) % 4) + 1
  return `${row}${String.fromCharCode(64 + col)}`
}

const STATUS_BADGE: Record<string, { bg: string; text: string; icon: ComponentType<{ className?: string }> }> = {
  boarded: { bg: 'bg-[#D1FAE5]', text: 'text-[#10B981]', icon: IconCheck },
  confirmed: { bg: 'bg-gray-100', text: 'text-[#4B5563]', icon: IconClock },
}

function isBoarded(item: ManifestItem) {
  return item.status === 'boarded'
}
function isPending(item: ManifestItem) {
  return item.status === 'confirmed' || item.status === 'pending'
}

function PassengerCard({ item }: { item: ManifestItem }) {
  const badge = STATUS_BADGE[isBoarded(item) ? 'boarded' : 'confirmed']
  const Icon = badge.icon
  return (
    <Card className="p-0 bg-white border h-[66px] border-[#E5E7EB] rounded-[10px]">
      <CardContent className="p-3 flex items-center gap-3">
        <div className="size-9 rounded-xl bg-[#F9FAFB] flex items-center justify-center shrink-0">
          <span className="text-[13px] font-bold text-[#111827]">{seatLabel(item.seat)}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[15px] font-semibold text-[#111827] truncate">Lugar {item.seat}</p>
          <p className="text-[11px] text-gray-500">Reserva {item.booking_id.slice(0, 8)}</p>
        </div>
        <span className={`shrink-0 size-8 rounded-full flex items-center justify-center ${badge.bg} ${badge.text}`}>
          <Icon className="size-5" />
        </span>
      </CardContent>
    </Card>
  )
}

export default function OperatorManifest() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const scheduleId = searchParams.get('schedule') ?? undefined
  const date = searchParams.get('date') ?? undefined
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState<'all' | 'boarded' | 'missing'>('all')

  const { manifest, isLoading, error, refetch } = useManifest(scheduleId)
  const { schedules } = useOperatorSchedules(date)
  const schedule = useMemo(
    () => schedules.find((s) => s.schedule_id === scheduleId),
    [schedules, scheduleId],
  )

  const active = useMemo(() => manifest.filter((m) => m.status !== 'cancelled'), [manifest])
  const boarded = active.filter(isBoarded)
  const pending = active.filter(isPending)
  const totalSeats = schedule?.total_seats ?? active.length
  const boardingPercent = totalSeats > 0 ? Math.round((boarded.length / totalSeats) * 100) : 0

  const query = search.trim()
  const visible = active.filter((m) => {
    if (query && !String(m.seat).includes(query)) return false
    if (activeTab === 'boarded') return isBoarded(m)
    if (activeTab === 'missing') return isPending(m)
    return true
  })
  const visibleBoarded = visible.filter(isBoarded)
  const visiblePending = visible.filter(isPending)

  if (!scheduleId) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] font-outfit flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-sm mb-4">Nenhuma viagem selecionada</p>
          <button type="button" onClick={() => navigate('/operator')} className="text-[#1B7A3D] font-semibold text-sm">
            Voltar ao painel
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-outfit">
      <header className="sticky top-0 z-40 bg-white pt-3 border-b border-gray-200">
        <div className="flex items-center justify-baseline gap-4 px-6">
          <button
            type="button"
            onClick={() => navigate('/operator')}
            aria-label="Voltar ao painel"
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <IconArrowLeft className="size-7 text-[#111827] font-bold" />
          </button>
          <div className="flex flex-col items-baseline justify-baseline text-[13px] pb-3">
            <h1 className="text-[22px] font-bold text-[#111827]">Manifesto de Embarque</h1>
            {schedule && (
              <div className='flex gap-1'>
                <RouteDisplay
                  origin={schedule.origin}
                  destination={schedule.destination}
                  className="text-[#4B5563]"
                  iconClassName="size-3.5"
                />
                <span className="text-[#4B5563]">·</span>
                <span className='text-[#4B5563]'>{schedule.departure_time}</span>
              </div>
            )}
          </div>
        </div>
        <section className="px-6 border-t flex items-center gap-3 h-[88px] border-gray-200">
          <div className="bg-[#1B7A3D]/10 w-12 h-12 flex items-center justify-center rounded-full shrink-0">
            <span className="text-[#1B7A3D] font-extrabold text-sm font-inter">{boardingPercent}%</span>
          </div>
          <div>
            <p className="text-base font-bold text-[#111827]">
              {boarded.length} de {totalSeats} embarcados
            </p>
            <span className="text-[#4B5563] text-xs">
              {pending.length > 0 ? `${pending.length} passageiros em falta` : 'Todos embarcados'}
            </span>
          </div>
        </section>
      </header>

      <main className="px-5 py-5">
        <nav className="flex gap-2 mb-4" aria-label="Filtro de passageiros">
          {([
            { key: 'all', label: 'Todos', count: null },
            { key: 'boarded', label: 'Embarcados', count: boarded.length },
            { key: 'missing', label: 'Em falta', count: pending.length },
          ] as const).map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`h-[32px] py-2 px-4 rounded-[20px] text-xs font-semibold transition-all border ${
                activeTab === tab.key
                  ? 'bg-[#1B7A3D] text-white border-[#1B7A3D]'
                  : 'bg-white text-[#4B5563] border-gray-200'
              }`}
              aria-pressed={activeTab === tab.key}
            >
              {tab.label}{' '}
              {tab.count !== null && (
                <span className={activeTab === tab.key ? 'text-white' : 'text-[#4B5563]'}>({tab.count})</span>
              )}
            </button>
          ))}
        </nav>

        <div className="relative mb-4 h-[42px] rounded-[8px]">
          <IconSearch className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#4B5563]" />
          <input
            type="text"
            inputMode="numeric"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por número de lugar"
            className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-gray-200 bg-white
             text-sm font-outfit placeholder:text-gray-400 focus:outline-none focus:ring-2
              focus:ring-[#1B7A3D]/30 focus:border-[#1B7A3D]"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label="Limpar pesquisa"
            >
              <IconX className="size-4" />
            </button>
          )}
        </div>

        {isLoading && (
          <div className="flex flex-col gap-2">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-[66px] animate-pulse rounded-[10px] bg-gray-100" />
            ))}
          </div>
        )}

        {!isLoading && error && (
          <div className="flex flex-col items-center gap-3 py-12 text-center">
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

        {!isLoading && !error && (
          <>
            {visibleBoarded.length > 0 && (
              <section>
                {activeTab !== 'all' && (
                  <h2 className="text-xs font-bold text-[#6B7280] uppercase tracking-wide mb-2">
                    Embarcados ({visibleBoarded.length})
                  </h2>
                )}
                <div className="flex flex-col gap-2 mb-5">
                  {visibleBoarded.map((item) => (
                    <PassengerCard key={item.booking_id} item={item} />
                  ))}
                </div>
              </section>
            )}

            {visiblePending.length > 0 && (
              <section>
                {activeTab !== 'all' && (
                  <h2 className="text-xs font-bold text-[#6B7280] uppercase tracking-wide mb-2">
                    Confirmados ({visiblePending.length})
                  </h2>
                )}
                <div className="flex flex-col gap-2 mb-5">
                  {visiblePending.map((item) => (
                    <PassengerCard key={item.booking_id} item={item} />
                  ))}
                </div>
              </section>
            )}

            {visible.length === 0 && (
              <div className="text-center py-10 text-gray-400 text-sm">Nenhum passageiro encontrado</div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
