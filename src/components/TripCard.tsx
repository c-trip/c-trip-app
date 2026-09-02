import { IconBus, IconArmchair } from '@tabler/icons-react'
import { Card, CardContent } from '@/components/ui/card'
import RouteDisplay from '@/components/RouteDisplay'
import { formatKz } from '@/lib/format'
import type { SearchResultItem } from '@/types/catalog'

interface TripCardProps {
  trip: SearchResultItem
  onSelect: (trip: SearchResultItem) => void
}

export default function TripCard({ trip, onSelect }: TripCardProps) {
  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={() => onSelect(trip)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect(trip)
        }
      }}
      className="p-0 cursor-pointer border-[#E5E7EB] hover:scale-[1.01] active:scale-[0.99] transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B7A3D] focus-visible:ring-offset-2"
    >
      <CardContent className="p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#1B7A3D]/10">
              <IconBus className="h-5 w-5 text-[#1B7A3D]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#111827]">{trip.company}</h3>
              <p className="text-[11px] text-gray-400">Partida {trip.departure_time}</p>
            </div>
          </div>
          <span className="font-outfit text-xl font-extrabold text-[#1B7A3D]">{formatKz(trip.price)}</span>
        </div>

        <div className="mb-3 text-sm font-semibold text-[#111827]">
          <RouteDisplay origin={trip.origin} destination={trip.destination} />
        </div>

        <div className="flex items-center gap-1.5 border-t border-gray-200 pt-2">
          <IconArmchair className="size-3.5 text-[#4B5563]" />
          <p className="text-xs font-medium text-[#4B5563]">{trip.available_seats} lugares livres</p>
        </div>
      </CardContent>
    </Card>
  )
}
