import { IconBus, IconRefresh } from '@tabler/icons-react'
import TripCard from './TripCard'
import type { SearchResultItem } from '@/types/catalog'

interface TripListProps {
  trips: SearchResultItem[]
  isLoading: boolean
  error: string | null
  onRetry: () => void
  onSelect: (trip: SearchResultItem) => void
  emptyLabel?: string
}

export default function TripList({
  trips,
  isLoading,
  error,
  onRetry,
  onSelect,
  emptyLabel = 'Nenhuma viagem encontrada',
}: TripListProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-28 animate-pulse rounded-2xl bg-gray-100" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <p className="text-sm text-[#4B5563]">{error}</p>
        <button
          type="button"
          onClick={onRetry}
          className="flex items-center gap-1.5 text-sm font-semibold text-[#1B7A3D]"
        >
          <IconRefresh className="size-4" />
          Tentar novamente
        </button>
      </div>
    )
  }

  if (trips.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
          <IconBus className="h-8 w-8 text-gray-400" />
        </div>
        <h2 className="text-base font-semibold text-gray-900">{emptyLabel}</h2>
        <p className="mt-1 text-sm text-gray-500">Ajuste a pesquisa ou os filtros.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {trips.map((trip) => (
        <TripCard key={trip.schedule_id} trip={trip} onSelect={onSelect} />
      ))}
    </div>
  )
}
