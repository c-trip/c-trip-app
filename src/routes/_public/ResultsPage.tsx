import { useNavigate } from 'react-router'
import DestinationCard from '../../components/DestinationCard'
import PageHeader from '@/components/PageHeader'
import { provincias, type Regiao } from '../../data/provincias'

const regiaoOrder: Regiao[] = ['Luanda', 'Norte', 'Centro', 'Sul', 'Leste']

const regiaoGradients: Record<Regiao, string> = {
  Luanda: 'from-[#1B7A3D] to-[#3A6356]',
  Norte: 'from-[#6B9E8C] to-[#3A6356]',
  Centro: 'from-[#4A7A6A] to-[#2A4A3D]',
  Sul: 'from-[#5C8E7C] to-[#2E5446]',
  Leste: 'from-[#7BAF9C] to-[#4A6B5E]',
}

export default function ResultsPage() {
  const navigate = useNavigate()

  const byRegiao = regiaoOrder.map((regiao) => ({
    regiao,
    items: provincias.filter((p) => p.regiao === regiao),
  }))

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-outfit">
      <PageHeader
        onBack={() => navigate(-1)}
        title="Destinos"
        subtitle="21 províncias de Angola"
      />

      <main className="px-5 py-5">
        {byRegiao.map(({ regiao, items }) => (
          <section key={regiao} className="mb-6">
            <h2 className="mb-3 text-sm font-semibold text-gray-500 uppercase tracking-wide">
              {regiao}
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {items.map((prov) => (
                <DestinationCard
                  key={prov.id}
                  origin={prov.nome}
                  destination={prov.capital}
                  gradient={regiaoGradients[regiao]}
                  onClick={() => navigate(`/search-results/${prov.id}`)}
                />
              ))}
            </div>
          </section>
        ))}
      </main>
    </div>
  )
}
