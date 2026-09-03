import { useMemo } from 'react'
import { useNavigate } from 'react-router'
import { IconMapPin, IconRefresh } from '@tabler/icons-react'
import PageHeader from '@/components/PageHeader'
import { Card, CardContent } from '@/components/ui/card'
import { useCities } from '@/hooks/catalog/useCatalog'

export default function ResultsPage() {
  const navigate = useNavigate()
  const { data: cities, isLoading, error, refetch } = useCities()

  const byProvince = useMemo(() => {
    const groups = new Map<string, { name: string }[]>()
    for (const city of cities ?? []) {
      const list = groups.get(city.province) ?? []
      list.push({ name: city.name })
      groups.set(city.province, list)
    }
    return [...groups.entries()]
      .map(([province, list]) => ({
        province,
        items: list.sort((a, b) => a.name.localeCompare(b.name, 'pt')),
      }))
      .sort((a, b) => a.province.localeCompare(b.province, 'pt'))
  }, [cities])

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-outfit">
      <PageHeader
        onBack={() => navigate(-1)}
        title="Cidades"
        subtitle={cities ? `${cities.length} cidades` : 'Escolha o destino'}
      />

      <main className="px-5 py-5">
        {isLoading && (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-20 animate-pulse rounded-xl bg-gray-100" />
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

        {!isLoading && !error && byProvince.map(({ province, items }) => (
          <section key={province} className="mb-6">
            <h2 className="mb-3 text-sm font-semibold text-gray-500 uppercase tracking-wide">{province}</h2>
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-3">
              {items.map((city) => (
                <Card
                  key={city.name}
                  role="button"
                  tabIndex={0}
                  onClick={() => navigate(`/search-results/${encodeURIComponent(city.name)}`)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      navigate(`/search-results/${encodeURIComponent(city.name)}`)
                    }
                  }}
                  className="w-full p-0 cursor-pointer border-[#E5E7EB] hover:scale-[1.01] active:scale-[0.99] transition-transform"
                >
                  <CardContent className="p-4 flex items-center gap-2">
                    <IconMapPin className="size-4 text-[#1B7A3D] shrink-0" />
                    <span className="text-sm font-semibold text-[#111827] truncate">{city.name}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        ))}
      </main>
    </div>
  )
}
