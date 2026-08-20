import { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router'
import { IconArrowLeft, IconBus } from '@tabler/icons-react'
import OperatorCard from '../../components/OperatorCard'
import { Tabs, TabsList, TabsTrigger } from '../../components/ui/tabs'
import { getOperatorsByRoute } from '../../data/mockOperators'
import type { Operator } from '@/types'

const TABS = [
  { value: 'todos', label: 'Todos' },
  { value: 'rapido', label: 'Mais rápido' },
  { value: 'barato', label: 'Mais barato' },
  { value: 'manha', label: 'Manhã' },
  { value: 'tarde', label: 'Tarde' },
] as const

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

function filterOperators(operators: Operator[], tab: string): Operator[] {
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
  const { route } = useParams<{ route: string }>()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('todos')

  const [originFormatted, destinationFormatted] = route
    ? route.split('-').map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    : ['', '']

  const allOperators = getOperatorsByRoute(originFormatted, destinationFormatted)
  const filteredOperators = useMemo(
    () => filterOperators(allOperators, activeTab),
    [allOperators, activeTab],
  )

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
          <div>
            <h1 className="text-lg font-bold text-gray-900">
              {originFormatted} → {destinationFormatted}
            </h1>
            <p className="text-xs text-gray-400">{allOperators.length} operadores disponiveis</p>
          </div>
        </div>
      </header>

      <div className="px-5 pt-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="bg-transparent">
          <TabsList variant="line" className="w-full bg-transparent ">
            {TABS.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="flex-1 rounded-full py-2 px-3.5 text-[13px] font-semibold 
                font-outfit border border-gray-200 !bg-white !text-black data-active:!bg-[#1B7A3D] 
                data-active:!text-white data-active:!border-[#1B7A3D]"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
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
