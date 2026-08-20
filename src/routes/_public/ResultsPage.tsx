import { useNavigate } from 'react-router'
import { IconArrowLeft } from '@tabler/icons-react'
import DestinationCard from '../../components/DestinationCard'
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
    <div className="min-h-screen bg-gray-50 font-outfit">
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white px-4 py-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            aria-label="Voltar"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 transition-colors hover:bg-gray-200"
          >
            <IconArrowLeft className="h-5 w-5 text-gray-700" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Destinos</h1>
            <p className="text-xs text-gray-400">18 províncias de Angola</p>
          </div>
        </div>
      </header>

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
