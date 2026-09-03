import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import HeaderCarousel from '../../components/HeaderCarousel'
import SearchCard from '../../components/SearchCard'
import PopularRoutes from '../../components/PopularRoutes'
import CitiesSection from '../../components/CitiesSection'
import TripList from '../../components/TripList'
import TripFilterDialog from '../../components/TripFilterDialog'
import { countActiveFilters, type TripFilters } from '@/lib/tripFilters'
import { useSearchTrips } from '@/hooks/catalog/useCatalog'
import { useBookingFlowStore } from '@/stores/bookingFlowStore'
import type { SearchResultItem } from '@/types/catalog'

export default function SearchPage() {
  const navigate = useNavigate()
  const setTrip = useBookingFlowStore((s) => s.setTrip)

  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState<TripFilters>({})
  const [filtersOpen, setFiltersOpen] = useState(false)

  const activeFilterCount = countActiveFilters(filters)

  const { data, isLoading, error, refetch } = useSearchTrips({
    date: filters.date,
    origin: filters.origin,
    destination: filters.destination,
    max_price: filters.maxPrice,
  })

  const trips = useMemo(() => {
    const list = data ?? []
    const q = query.trim().toLowerCase()
    if (!q) return list
    return list.filter(
      (t) =>
        t.company.toLowerCase().includes(q) ||
        t.origin.toLowerCase().includes(q) ||
        t.destination.toLowerCase().includes(q),
    )
  }, [data, query])

  const handleSelect = (item: SearchResultItem) => {
    setTrip({
      scheduleId: item.schedule_id,
      routeId: item.route_id,
      company: item.company,
      origin: item.origin,
      destination: item.destination,
      departureTime: item.departure_time,
      departureDate: filters.date,
      price: item.price,
      availableSeats: item.available_seats,
    })
    navigate(`/schedules/${item.schedule_id}`)
  }

  const showPopular = !query && activeFilterCount === 0

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-outfit pb-24">
      <header className="relative w-full">
        <HeaderCarousel />
      </header>

      <div className="relative z-10 -mt-6 px-4">
        <SearchCard
          query={query}
          onQueryChange={setQuery}
          onOpenFilters={() => setFiltersOpen(true)}
          activeFilterCount={activeFilterCount}
        />
      </div>

      {showPopular && (
        <div className="px-4">
          <CitiesSection />
          <PopularRoutes />
        </div>
      )}

      <main className="px-4 pt-6">
        <div className="mb-3 flex items-center justify-between px-1">
          <h2 className="text-base font-bold text-gray-900">
            {showPopular ? 'Todas as viagens' : 'Resultados'}
          </h2>
          {!isLoading && !error && (
            <span className="text-xs font-semibold text-[#1B7A3D]">
              {trips.length} {trips.length === 1 ? 'viagem' : 'viagens'}
            </span>
          )}
        </div>

        <TripList
          trips={trips}
          isLoading={isLoading}
          error={error}
          onRetry={() => void refetch()}
          onSelect={handleSelect}
        />
      </main>

      {filtersOpen && (
        <TripFilterDialog
          value={filters}
          onApply={setFilters}
          onClose={() => setFiltersOpen(false)}
        />
      )}
    </div>
  )
}
