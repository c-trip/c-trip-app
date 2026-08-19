import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  IconArrowsLeftRight,
  IconCalendar,
  IconUser,
  IconSearch,
} from '@tabler/icons-react'

interface SearchCardProps {
  origin?: string
  destination?: string
  date?: string
  passengers?: number
  onSearch?: () => void
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return '—'
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('pt-PT', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default function SearchCard({
  origin = 'Luanda',
  destination = 'Benguela',
  date = '2026-08-15',
  passengers = 1,
  onSearch,
}: SearchCardProps) {
  return (
    <Card className="w-full rounded-[20px] border border-gray-200 bg-white shadow-md px-5 py-5 gap-0">
      <CardContent className="px-0 py-0">
        {/* Origem → Destino */}
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-xs text-gray-400 font-medium">Origem</p>
            <h1 className="text-base font-semibold text-gray-900">{origin}</h1>
          </div>

          <div className="mx-4 flex items-center justify-center w-10 h-10 rounded-full bg-[#3A6356]/10">
            <IconArrowsLeftRight className="w-5 h-5 text-[#3A6356]" />
          </div>

          <div className="flex-1 text-right">
            <p className="text-xs text-gray-400 font-medium">Destino</p>
            <h1 className="text-base font-semibold text-gray-900">{destination}</h1>
          </div>
        </div>

        {/* Separador */}
        <div className="my-4 border-t border-gray-200" />

        {/* Partida + Passageiros */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-2.5">
            <div className="mt-0.5 flex items-center justify-center w-8 h-8 rounded-full bg-[#3A6356]/10">
              <IconCalendar className="w-4 h-4 text-[#3A6356]" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Partida</p>
              <h1 className="text-sm font-semibold text-gray-900 capitalize">{formatDate(date)}</h1>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <div className="mt-0.5 flex items-center justify-center w-8 h-8 rounded-full bg-[#3A6356]/10">
              <IconUser className="w-4 h-4 text-[#3A6356]" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Passageiros</p>
              <h1 className="text-sm font-semibold text-gray-900">
                {passengers === 1 ? '1 pessoa' : `${passengers} pessoas`}
              </h1>
            </div>
          </div>
        </div>

        {/* Separador */}
        <div className="my-4 border-t border-gray-200" />

        {/* Botão */}
        <Button
          onClick={onSearch}
          className="w-full h-12 rounded-2xl bg-gradient-to-r from-[#6B9E8C] to-[#3A6356] text-white font-semibold text-sm hover:opacity-90 transition-opacity cursor-pointer"
        >
          <IconSearch className="w-5 h-5" />
          Pesquisar bilhetes
        </Button>
      </CardContent>
    </Card>
  )
}
