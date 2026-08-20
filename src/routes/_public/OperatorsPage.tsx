import { useParams, useNavigate } from 'react-router'
import { IconArrowLeft, IconBus } from '@tabler/icons-react'
import OperatorCard from '../../components/OperatorCard'
import { getOperatorsByRoute } from '../../data/mockOperators'

export default function OperatorsPage() {
  const { route } = useParams<{ route: string }>()
  const navigate = useNavigate()

  const [originFormatted, destinationFormatted] = route
    ? route.split('-').map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    : ['', '']

  const operators = getOperatorsByRoute(originFormatted, destinationFormatted)

  return (
    <div className="min-h-screen bg-gray-50 font-outfit">
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white px-4 py-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 transition-colors hover:bg-gray-200"
          >
            <IconArrowLeft className="h-5 w-5 text-gray-700" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-gray-900">
              {originFormatted} → {destinationFormatted}
            </h1>
            <p className="text-xs text-gray-400">{operators.length} operadores disponiveis</p>
          </div>
        </div>
      </header>

      <main className="px-4 py-4">
        {operators.length > 0 ? (
          <div className="flex flex-col gap-4">
            {operators.map((operator) => (
              <OperatorCard
                key={operator.id}
                operator={operator}
                onSelect={(op) => navigate(`/schedules/${op.id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <IconBus className="h-8 w-8 text-gray-400" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Nenhuma operadora encontrada</h2>
            <p className="mt-1 text-sm text-gray-500">
              Nao ha operadores disponiveis para esta rota neste momento.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
