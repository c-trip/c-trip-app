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
    <Card className="w-full gap-0 rounded-[20px] border border-gray-200 bg-white px-5 py-5 shadow-md">
      <CardContent className="px-0 py-0">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-xs font-medium text-gray-400">Origem</p>
            <p className="text-base font-semibold text-gray-900">{origin}</p>
          </div>

          <div className="mx-4 flex h-10 w-10 items-center justify-center rounded-full bg-green-gradient-end/10">
            <IconArrowsLeftRight className="h-5 w-5 text-green-gradient-end" />
          </div>

          <div className="flex-1 text-right">
            <p className="text-xs font-medium text-gray-400">Destino</p>
            <p className="text-base font-semibold text-gray-900">{destination}</p>
          </div>
        </div>

        <div className="my-4 border-t border-gray-200" />

        <div className="flex items-start justify-between">
          <div className="flex items-start gap-2.5">
            <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-green-gradient-end/10">
              <IconCalendar className="h-4 w-4 text-green-gradient-end" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-400">Partida</p>
              <p className="text-sm font-semibold capitalize text-gray-900">
                {formatDate(date)}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-green-gradient-end/10">
              <IconUser className="h-4 w-4 text-green-gradient-end" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-400">Passageiros</p>
              <p className="text-sm font-semibold text-gray-900">
                {passengers === 1 ? '1 pessoa' : `${passengers} pessoas`}
              </p>
            </div>
          </div>
        </div>

        <div className="my-4 border-t border-gray-200" />

        <Button
          onClick={onSearch}
          className="h-12 w-full cursor-pointer rounded-2xl bg-gradient-to-r from-green-gradient-start to-green-gradient-end font-semibold text-sm text-white hover:opacity-90 transition-opacity"
        >
          <IconSearch className="h-5 w-5" />
          Pesquisar bilhetes
        </Button>
      </CardContent>
    </Card>
  )
}
