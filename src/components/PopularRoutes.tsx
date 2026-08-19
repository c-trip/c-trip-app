import { IconChevronRight } from '@tabler/icons-react'
import DestinationCard from './DestinationCard'

const routes = [
  { origin: 'Luanda', destination: 'Bengo', price: '4 500 Kz', gradient: 'from-[#6B9E8C] to-[#3A6356]' },
  { origin: 'Benguela', destination: 'Huambo', price: '3 200 Kz', gradient: 'from-[#3A6356] to-[#1B3D2F]' },
  { origin: 'Huambo', destination: 'Lubango', price: '3 800 Kz', gradient: 'from-[#4A7A6A] to-[#2A4A3D]' },
  { origin: 'Luanda', destination: 'Benguela', price: '4 100 Kz', gradient: 'from-[#5C8E7C] to-[#2E5446]' },
  { origin: 'Lobito', destination: 'Namibe', price: '3 500 Kz', gradient: 'from-[#7BAF9C] to-[#4A6B5E]' },
  { origin: 'Luanda', destination: 'Huambo', price: '5 000 Kz', gradient: 'from-[#2A4A3D] to-[#1B3D2F]' },
]

interface PopularRoutesProps {
  onViewAll?: () => void
  onSelectRoute?: (origin: string, destination: string) => void
}

export default function PopularRoutes({ onViewAll, onSelectRoute }: PopularRoutesProps) {
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
        {routes.map((route) => (
          <DestinationCard
            key={`${route.origin}-${route.destination}`}
            origin={route.origin}
            destination={route.destination}
            price={route.price}
            gradient={route.gradient}
            onClick={() => onSelectRoute?.(route.origin, route.destination)}
          />
        ))}
      </div>
    </section>
  )
}
