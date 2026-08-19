import { Card, CardContent } from '@/components/ui/card'
import { IconArrowsRight } from '@tabler/icons-react'

interface DestinationCardProps {
  origin: string
  destination: string
  price?: string
  gradient?: string
  onClick?: () => void
}

export default function DestinationCard({
  origin,
  destination,
  price,
  gradient = 'from-green-gradient-start to-green-gradient-end',
  onClick,
}: DestinationCardProps) {
  return (
    <Card
      onClick={onClick}
      className="min-w-[180px] cursor-pointer overflow-hidden rounded-2xl border-none p-0 shadow-md transition-transform hover:scale-[1.02]"
    >
      <div className={`flex h-28 w-full items-end bg-gradient-to-br ${gradient} p-3`}>
        <div className="flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 backdrop-blur-sm">
          <span className="text-xs font-semibold text-white">{origin}</span>
          <IconArrowsRight className="h-3 w-3 text-white" />
          <span className="text-xs font-semibold text-white">{destination}</span>
        </div>
      </div>
      {price && (
        <CardContent className="px-3 py-2.5">
          <p className="text-xs text-gray-400">A partir de</p>
          <p className="text-sm font-bold text-gray-900">{price}</p>
        </CardContent>
      )}
    </Card>
  )
}
