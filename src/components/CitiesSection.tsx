import { useMemo } from 'react'
import { useNavigate } from 'react-router'
import { IconChevronRight } from '@tabler/icons-react'
import CityCard from './CityCard'
import { useCities } from '@/hooks/catalog/useCatalog'

/** Cidades destacadas na SearchPage — cidades maiores primeiro. */
const PRIORITY = [
  'Luanda', 'Benguela', 'Lubango', 'Huambo', 'Lobito', 'Namibe',
  'Malanje', 'Cabinda', 'Soyo', 'Sumbe', 'Uíge', 'Menongue',
]

export default function CitiesSection() {
  const navigate = useNavigate()
  const { data, isLoading, error } = useCities()

  const cities = useMemo(() => {
    const list = data ?? []
    const rank = (name: string) => {
      const i = PRIORITY.indexOf(name)
      return i === -1 ? PRIORITY.length : i
    }
    return [...list].sort((a, b) => rank(a.name) - rank(b.name) || a.name.localeCompare(b.name, 'pt')).slice(0, 10)
  }, [data])

  if (!isLoading && (error || cities.length === 0)) return null

  return (
    <section className="mt-8">
      <div className="mb-4 flex items-center justify-between px-1">
        <h2 className="text-lg font-bold text-gray-900">Cidades</h2>
        <button
          onClick={() => navigate('/search/results')}
          className="flex items-center gap-1 text-sm font-medium text-green-gradient-end hover:underline"
        >
          Ver tudo
          <IconChevronRight className="h-4 w-4" />
        </button>
      </div>

      {isLoading ? (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-40 w-[150px] shrink-0 animate-pulse rounded-2xl bg-gray-100" />
          ))}
        </div>
      ) : (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
          {cities.map((city) => (
            <div key={city.id} className="w-[150px] shrink-0">
              <CityCard
                name={city.name}
                province={city.province}
                onClick={() => navigate(`/search-results/${encodeURIComponent(city.name)}`)}
                className="h-40"
              />
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
