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

export default function SearchCard({
  origin = 'Luanda',
  destination = 'Benguela',
  date = '15 Ago 2026',
  passengers = 1,
  onSearch,
}: SearchCardProps) {
  return (
    <Card className="w-full gap-4 rounded-[20px] border border-gray-200 font-outfit
    bg-white p-6 shadow-md mt-12 ">
      <CardContent className="px-0 py-0">
        <div className="flex items-center justify-between  bg-[#eaecf0] border-2 
        border-[#E5E7EB] p-4 rounded-xl">
          <div className="flex-1 border p-4 border-gray-200 rounded-lg bg-white">
            <p className="text-xs font-medium text-gray-400">Origem</p>
            <p className="text-base font-semibold text-gray-900">{origin}</p>
            <p className="text-base font-semibold text-gray-900">(terminal)</p>
          </div>

          <div className="mx-4 flex h-10 w-10 p-2 items-center justify-center rounded-full bg-white border 
          border-[#E5E7EB]">
            <IconArrowsLeftRight className=" text-green-gradient-end border rounded-full 
            p-1 border-[#E5E7EB]" />
          </div>

          <div className="flex-1 text-left border p-4 border-gray-200 rounded-lg bg-white">
            <p className="text-xs font-medium text-gray-400">Destino</p>
            <p className="text-base font-semibold text-gray-900">{destination}</p>
             <p className="text-base font-semibold text-gray-900">(Terminal)</p>
          </div>
        </div>

        <div className="my-4 border-t border-gray-200" />

        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-2.5 border border-[#E5E7EB] p-3.5 rounded-2xl">
            <div className="mt-0.5 flex h-8 w-12 items-center justify-center rounded-full">
              <IconCalendar className="size-6 text-green-gradient-end" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-400">Partida</p>
              <p className="text-sm font-semibold capitalize text-gray-900">
                {date}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 border border-[#E5E7EB] p-3.5 rounded-2xl">
            <div className="mt-0.5 flex h-8 w-12 items-center justify-center rounded-full">
              <IconUser className="size-6 text-green-gradient-end" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-400">Passageiros</p>
              <p className="text-sm font-semibold text-gray-900">
                {passengers === 1 ? '1 pessoa' : `${passengers} pessoas`}
              </p>
            </div>
          </div>
        </div>


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
