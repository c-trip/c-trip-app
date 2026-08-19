import { IconChevronRight } from '@tabler/icons-react'
import DestinationCard from './DestinationCard'

const destinations = [
  { city: 'Luanda', price: '4 500 Kz', gradient: 'from-[#6B9E8C] to-[#3A6356]' },
  { city: 'Benguela', price: '3 200 Kz', gradient: 'from-[#3A6356] to-[#1B3D2F]' },
  { city: 'Huambo', price: '3 800 Kz', gradient: 'from-[#4A7A6A] to-[#2A4A3D]' },
  { city: 'Lubango', price: '4 100 Kz', gradient: 'from-[#5C8E7C] to-[#2E5446]' },
  { city: 'Lobito', price: '3 500 Kz', gradient: 'from-[#7BAF9C] to-[#4A6B5E]' },
  { city: 'Namibe', price: '5 000 Kz', gradient: 'from-[#2A4A3D] to-[#1B3D2F]' },
]

interface PopularRoutesProps {
  onViewAll?: () => void
  onSelectCity?: (city: string) => void
}

export default function PopularRoutes({ onViewAll, onSelectCity }: PopularRoutesProps) {
  return (
    <section className="mt-8">
      <div className="mb-4 flex items-center justify-between px-1">
        <h2 className="text-lg font-bold text-gray-900">Rotas populares</h2>
        <button
          onClick={onViewAll}
          className="flex items-center gap-1 text-sm font-medium text-green-gradient-end hover:underline"
        >
          Ver tudo
          <IconChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
        {destinations.map((dest) => (
          <DestinationCard
            key={dest.city}
            city={dest.city}
            price={dest.price}
            gradient={dest.gradient}
            onClick={() => onSelectCity?.(dest.city)}
          />
        ))}
      </div>
    </section>
  )
}
