import { useNavigate } from 'react-router'
import { IconChevronRight } from '@tabler/icons-react'
import DestinationCard from './DestinationCard'
import { popularRoutes } from '../data/popularRoutes'

interface PopularRoutesProps {
  onViewAll?: () => void
  onSelectRoute?: (origin: string, destination: string) => void
}

export default function PopularRoutes({ onViewAll, onSelectRoute }: PopularRoutesProps) {
  const navigate = useNavigate()

  const handleViewAll = () => {
    if (onViewAll) {
      onViewAll()
    } else {
      navigate('/search-results')
    }
  }

  const handleSelectRoute = (origin: string, destination: string) => {
    if (onSelectRoute) {
      onSelectRoute(origin, destination)
    } else {
      const key = `${origin.toLowerCase()}-${destination.toLowerCase()}`
      navigate(`/search-results/${key}`)
    }
  }

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

      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
        {popularRoutes.map((route) => (
          <DestinationCard
            key={`${route.origin}-${route.destination}`}
            origin={route.origin}
            destination={route.destination}
            price={route.price}
            gradient={route.gradient}
            onClick={() => handleSelectRoute(route.origin, route.destination)}
          />
        ))}
      </div>
    </section>
  )
}
