import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  IconBus,
  IconClock,
  IconCoinFilled,
  IconArmchair,
  IconStarFilled,
  IconRoute,
} from '@tabler/icons-react'
import type { Operator } from '@/types'

interface OperatorCardProps {
  operator: Operator
  onSelect?: (operator: Operator) => void
}

export default function OperatorCard({ operator, onSelect }: OperatorCardProps) {
  return (
    <Card className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md">
      <CardContent className="p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-gradient-start/10">
              <IconBus className="h-6 w-6 text-green-gradient-end" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">{operator.name}</h3>
              <div className="flex items-center gap-1">
                <IconStarFilled className="h-3.5 w-3.5 text-yellow-400" />
                <span className="text-xs font-medium text-gray-500">{operator.rating}</span>
              </div>
            </div>
          </div>
          <span className="rounded-full bg-green-gradient-end/10 px-3 py-1 text-xs font-semibold text-green-gradient-end">
            {operator.vehicleType}
          </span>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 rounded-xl bg-gray-50 p-2.5">
            <IconCoinFilled className="h-4 w-4 text-green-gradient-end" />
            <div>
              <p className="text-[10px] text-gray-400">Preco</p>
              <p className="text-sm font-bold text-gray-900">{operator.price}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-gray-50 p-2.5">
            <IconClock className="h-4 w-4 text-green-gradient-end" />
            <div>
              <p className="text-[10px] text-gray-400">Duracao</p>
              <p className="text-sm font-bold text-gray-900">{operator.duration}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-gray-50 p-2.5">
            <IconArmchair className="h-4 w-4 text-green-gradient-end" />
            <div>
              <p className="text-[10px] text-gray-400">Lugares</p>
              <p className="text-sm font-bold text-gray-900">{operator.availableSeats}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-gray-50 p-2.5">
            <IconRoute className="h-4 w-4 text-green-gradient-end" />
            <div>
              <p className="text-[10px] text-gray-400">Saida</p>
              <p className="text-sm font-bold text-gray-900">{operator.departureTime}</p>
            </div>
          </div>
        </div>

        <Button
          onClick={() => onSelect?.(operator)}
          className="h-12 w-full cursor-pointer rounded-2xl bg-gradient-to-r from-green-gradient-start to-green-gradient-end font-semibold text-sm text-white hover:opacity-90 transition-opacity"
        >
          Seleccionar viagem
        </Button>
      </CardContent>
    </Card>
  )
}
