import { Card, CardContent } from '@/components/ui/card'

import {
  IconArmchair,
  IconBus,

  IconStarFilled,
} from '@tabler/icons-react'
import type { Operator } from '@/types'

interface OperatorCardProps {
  operator: Operator
  onSelect?: (operator: Operator) => void
}

export default function OperatorCard({ operator, }: OperatorCardProps) {
  return (
    <Card className="overflow-hidden rounded-b-xl border border-[#E5E7EB] bg-white ">
      <CardContent className="gap-2 grid grid-cols-1">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-gradient-start/10">
              <IconBus className="h-6 w-6 text-green-gradient-end" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#111827] font-outfit">{operator.name}</h3>
              <div className="flex items-center gap-1">
                <IconStarFilled className="h-3.5 w-3.5 text-yellow-400" />
                <span className="text-xs font-medium text-gray-500">{operator.rating}</span>
              </div>
            </div>
          </div>
          <span className="font-outfit text-xl font-extrabold
           text-[#1B7A3D]">
            {operator.price}
          </span>
        </div>

        <div className="mb-4 flex justify-between items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl ">
            <div>
              <p className="text-lg font-bold text-[#111827]">{operator.departureTime}</p>
              <p className="text-[10px] text-gray-400">Luanda</p>
            </div>
          </div>

          
          <div className='flex flex-col gap-2 justify-center items-center'>
            <p className='font-light text-[11px] text-[#9CA3AF] '>{operator.duration}</p>
            <img src="  /timeline-line-wrap.svg" alt="" />
          </div>

           <div className="flex items-center gap-2 rounded-xl ">
            <div>
              <p className="text-lg font-bold text-[#111827]">{operator.arrivalTime}</p>
              <p className="text-[10px] text-gray-400">Arrivals</p>
            </div>
          </div>
        </div>
        <div className='w-full h-0.5 border-t-2 border-gray-200'></div>

        <div className='flex justify-between items-center gap-2'>
          <div className='flex  gap-1 justify-center items-center'>
             <IconArmchair className="size-3 text-[#4B5563]" />
             <p className='font-medium text-[#4B5563] text-xs'>{operator.availableSeats} lugares livre</p>
          </div>
          <p className='font-medium text-[#4B5563] text-xs'>{operator.vehicleType}</p>
        </div>
      </CardContent>
    </Card>
  )
}
