import { useMemo, useState } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router'
import PageHeader from '@/components/PageHeader'
import TripList from '@/components/TripList'
import { useSearchTrips } from '@/hooks/catalog/useCatalog'
import { useBookingFlowStore } from '@/stores/bookingFlowStore'
import type { SearchResultItem } from '@/types/catalog'

const TABS = [
  { value: 'todos', label: 'Todos' },
  { value: 'barato', label: 'Mais barato' },
  { value: 'manha', label: 'Manhã' },
  { value: 'tarde', label: 'Tarde' },
] as const

type TabValue = (typeof TABS)[number]['value']

function parseHour(time: string): number {
  return parseInt(time.split(':')[0], 10) || 0
}

function applyTab(items: SearchResultItem[], tab: TabValue): SearchResultItem[] {
  const list = [...items]
  switch (tab) {
    case 'barato':
      return list.sort((a, b) => a.price - b.price)
    case 'manha':
      return list.filter((i) => parseHour(i.departure_time) < 12)
    case 'tarde':
      return list.filter((i) => parseHour(i.departure_time) >= 12)
    default:
      return list.sort((a, b) => a.departure_time.localeCompare(b.departure_time))
  }
}

function formatSubtitle(date: string | null, count: number): string {
  const base = count === 1 ? '1 viagem' : `${count} viagens`
  if (!date) return base
  const d = new Date(`${date}T12:00:00`)
  if (Number.isNaN(d.getTime())) return base
  const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']
  return `${d.getDate()} ${months[d.getMonth()]} · ${base}`
}

export default function OperatorsPage() {
  const { origin, destination } = useParams<{ origin: string; destination?: string }>()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const setTrip = useBookingFlowStore((s) => s.setTrip)
  const [activeTab, setActiveTab] = useState<TabValue>('todos')

  const date = searchParams.get('date') ?? undefined
  const originName = origin ? decodeURIComponent(origin) : undefined
  const destinationName = destination ? decodeURIComponent(destination) : undefined

  const { data, isLoading, error, refetch } = useSearchTrips({
    origin: originName,
    destination: destinationName,
    date,
  })

  const results = useMemo(() => data ?? [], [data])
  const filtered = useMemo(() => applyTab(results, activeTab), [results, activeTab])

  const title = destinationName ? `${originName} → ${destinationName}` : originName ?? 'Viagens'

  const handleSelect = (item: SearchResultItem) => {
    setTrip({
      scheduleId: item.schedule_id,
      routeId: item.route_id,
      company: item.company,
      origin: item.origin,
      destination: item.destination,
      departureTime: item.departure_time,
      departureDate: date,
      price: item.price,
      availableSeats: item.available_seats,
    })
    navigate(`/schedules/${item.schedule_id}`)
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-outfit">
      <div className="sticky top-0 z-20">
        <PageHeader
          className="static"
          onBack={() => navigate(-1)}
          title={title}
          subtitle={formatSubtitle(date ?? null, results.length)}
        />
        <div className="flex gap-2 overflow-x-auto px-5 py-3 bg-gray-50/80 backdrop-blur-xl scrollbar-none">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              aria-pressed={activeTab === tab.value}
              className={`whitespace-nowrap rounded-full py-2 px-3.5 text-[13px] font-semibold font-outfit border transition-colors ${
                activeTab === tab.value
                  ? 'bg-[#1B7A3D1A] text-[#1B7A3D] border-[#1B7A3D]'
                  : 'bg-white text-[#4B5563] border-[#E5E7EB]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <main className="px-5 py-5">
        <TripList
          trips={filtered}
          isLoading={isLoading}
          error={error}
          onRetry={() => void refetch()}
          onSelect={handleSelect}
          emptyLabel="Nenhuma viagem encontrada"
        />
      </main>
    </div>
  )
}
