import { useState } from 'react'
import { IconMapPin } from '@tabler/icons-react'
import { cityImage, cityGradient } from '@/data/cityImages'

interface CityCardProps {
  name: string
  province?: string
  onClick?: () => void
}

export default function CityCard({ name, province, onClick }: CityCardProps) {
  const [failed, setFailed] = useState(false)

  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative h-40 w-[150px] shrink-0 overflow-hidden rounded-2xl shadow-md transition-transform hover:scale-[1.02] active:scale-[0.99]"
    >
      {failed ? (
        <div className={`h-full w-full bg-gradient-to-br ${cityGradient(name)}`} />
      ) : (
        <img
          src={cityImage(name)}
          alt={name}
          loading="lazy"
          onError={() => setFailed(true)}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 p-3 text-left text-white">
        <p className="text-sm font-bold leading-tight">{name}</p>
        {province && (
          <span className="mt-0.5 flex items-center gap-1 text-[10px] font-medium text-white/80">
            <IconMapPin className="size-3" />
            {province}
          </span>
        )}
      </div>
    </button>
  )
}
