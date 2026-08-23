import { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router'
import { IconArrowLeft, IconBus } from '@tabler/icons-react'
import OperatorCard from '../../components/OperatorCard'
import { getOperatorsByRoute } from '../../data/mockOperators'
import { provincias } from '../../data/provincias'
import type { Operator } from '@/types'

const TABS = [
  { value: 'todos', label: 'Todos' },
  { value: 'rapido', label: 'Mais rápido' },
  { value: 'barato', label: 'Mais barato' },
  { value: 'manha', label: 'Manhã' },
  { value: 'tarde', label: 'Tarde' },
] as const

type TabValue = (typeof TABS)[number]['value']

function parseDurationToMinutes(duration: string): number {
  let total = 0
  const hMatch = duration.match(/(\d+)\s*h/)
  const mMatch = duration.match(/(\d+)\s*min/)
  if (hMatch) total += parseInt(hMatch[1], 10) * 60
  if (mMatch) total += parseInt(mMatch[1], 10)
  return total
}

function parsePrice(price: string): number {
  return parseInt(price.replace(/\D/g, ''), 10)
}

function parseHour(time: string): number {
  return parseInt(time.split(':')[0], 10)
}

function filterOperators(operators: Operator[], tab: TabValue): Operator[] {
  const sorted = [...operators]
  switch (tab) {
    case 'rapido':
      return sorted.sort(
        (a, b) => parseDurationToMinutes(a.duration) - parseDurationToMinutes(b.duration),
      )
    case 'barato':
      return sorted.sort((a, b) => parsePrice(a.price) - parsePrice(b.price))
    case 'manha':
      return sorted.filter((op) => parseHour(op.departureTime) < 12)
    case 'tarde':
      return sorted.filter((op) => parseHour(op.departureTime) >= 12)
    default:
      return sorted
  }
}

export default function OperatorsPage() {
  const { origin, destination } = useParams<{ origin: string; destination?: string }>()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<TabValue>('todos')

  const originFormatted = origin
    ? origin.charAt(0).toUpperCase() + origin.slice(1)
    : ''
  const destinationFormatted = destination
    ? destination.charAt(0).toUpperCase() + destination.slice(1)
    : ''

  const originProvince = provincias.find((p) => p.id === origin)
  const destinationProvince = provincias.find((p) => p.id === destination)

  const title = destinationProvince
    ? `${originProvince?.nome ?? originFormatted} → ${destinationProvince.nome}`
    : originProvince?.nome ?? originFormatted

  const allOperators = getOperatorsByRoute(originFormatted, destinationFormatted)
  const filteredOperators = useMemo(
    () => filterOperators(allOperators, activeTab),
    [allOperators, activeTab],
  )

  return (
    <div className="min-h-screen bg-gray-50 font-outfit">
      <div className="sticky top-0 z-10">
        <div className="bg-white border-b border-gray-200 px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 transition-colors hover:bg-gray-200"
            >
              <IconArrowLeft className="h-5 w-5 text-gray-700" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-gray-900">{title}</h1>
              <p className="text-xs text-gray-400">{filteredOperators.length} operadores disponíveis</p>
            </div>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto px-5 py-3 bg-gray-50/80 backdrop-blur-xl scrollbar-none">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              aria-pressed={activeTab === tab.value}
              className={`whitespace-nowrap rounded-full py-2 px-3.5 text-[13px] font-semibold font-outfit border transition-colors ${
                activeTab === tab.value
                  ? 'bg-[#1B7A3D] text-white border-[#1B7A3D]'
                  : 'bg-white text-black border-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <main className="px-5 py-5">
        {filteredOperators.length > 0 ? (
          <div className="flex flex-col gap-4">
            {filteredOperators.map((operator) => (
              <OperatorCard
                key={operator.id}
                operator={operator}
                onSelect={(op) => navigate(`/schedules/${op.id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <IconBus className="h-8 w-8 text-gray-400" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Nenhuma operadora encontrada</h2>
            <p className="mt-1 text-sm text-gray-500">
              Nao ha operadores disponiveis para esta rota neste momento.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
