import { useNavigate } from 'react-router'
import { IconChevronRight } from '@tabler/icons-react'
import DestinationCard from './DestinationCard'
import { usePopular } from '@/hooks/catalog/useCatalog'

interface PopularRoutesProps {
  onViewAll?: () => void
  onSelectRoute?: (origin: string, destination: string) => void
}

const GRADIENTS = [
  'from-[#6B9E8C] to-[#3A6356]',
  'from-[#3A6356] to-[#1B3D2F]',
  'from-[#4A7A6A] to-[#2A4A3D]',
  'from-[#5C8E7C] to-[#2E5446]',
  'from-[#7BAF9C] to-[#4A6B5E]',
  'from-[#2A4A3D] to-[#1B3D2F]',
]

function formatKz(value: number): string {
  return `${Math.round(value).toLocaleString('pt-PT')} Kz`
}

export default function PopularRoutes({ onViewAll, onSelectRoute }: PopularRoutesProps) {
  const navigate = useNavigate()
  const { data, isLoading, error } = usePopular(0, 6)

  const routes = data?.popular_routes ?? []

  const handleViewAll = () => {
    if (onViewAll) onViewAll()
    else navigate('/search/results')
  }

  const handleSelectRoute = (origin: string, destination: string) => {
    if (onSelectRoute) onSelectRoute(origin, destination)
    else navigate(`/search-results/${encodeURIComponent(origin)}/${encodeURIComponent(destination)}`)
  }

  if (!isLoading && (error || routes.length === 0)) return null

  return (
    <section className="mt-8">
      <div className="mb-4 flex items-center justify-between px-1">
        <h2 className="text-lg font-bold text-gray-900">Rotas populares</h2>
        <button
          onClick={handleViewAll}
          className="flex items-center gap-1 text-sm font-medium text-green-gradient-end hover:underline"
        >
          Ver tudo
          <IconChevronRight className="h-4 w-4" />
        </button>
      </div>

      {isLoading ? (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-40 min-w-[180px] animate-pulse rounded-2xl bg-gray-100" />
          ))}
        </div>
      ) : (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
          {routes.map((route, i) => (
            <DestinationCard
              key={`${route.origin}-${route.destination}`}
              origin={route.origin}
              destination={route.destination}
              price={formatKz(route.avg_price)}
              gradient={GRADIENTS[i % GRADIENTS.length]}
              onClick={() => handleSelectRoute(route.origin, route.destination)}
            />
          ))}
        </div>
      )}
    </section>
  )
}
