import { useMemo } from 'react'
import { useNavigate } from 'react-router'
import { IconRefresh } from '@tabler/icons-react'
import PageHeader from '@/components/PageHeader'
import CityCard from '@/components/CityCard'
import { useCities } from '@/hooks/catalog/useCatalog'

export default function ResultsPage() {
  const navigate = useNavigate()
  const { data: cities, isLoading, error, refetch } = useCities()

  const sorted = useMemo(
    () => [...(cities ?? [])].sort((a, b) => a.name.localeCompare(b.name, 'pt')),
    [cities],
  )

  const goToCity = (name: string) => navigate(`/search-results/${encodeURIComponent(name)}`)

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-outfit">
      <PageHeader
        onBack={() => navigate(-1)}
        title="Cidades"
        subtitle={cities ? `${cities.length} cidades` : 'Escolha o destino'}
      />

      <main className="px-5 py-5">
        {isLoading && (
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-32 animate-pulse rounded-2xl bg-gray-100" />
            ))}
          </div>
        )}

        {!isLoading && error && (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <p className="text-sm text-[#4B5563]">{error}</p>
            <button
              type="button"
              onClick={() => void refetch()}
              className="flex items-center gap-1.5 text-sm font-semibold text-[#1B7A3D]"
            >
              <IconRefresh className="size-4" />
              Tentar novamente
            </button>
          </div>
        )}

        {!isLoading && !error && (
          <div className="grid grid-cols-2 gap-3">
            {sorted.map((city) => (
              <CityCard
                key={city.id}
                name={city.name}
                province={city.province}
                onClick={() => goToCity(city.name)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
