import { useEffect, useState } from 'react'
import { IconMapPin } from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import { cityImage, cityGradient } from '@/data/cityImages'

interface CityCardProps {
  name: string
  province?: string
  onClick?: () => void
  /** Classes extra (ex.: altura). Por defeito ocupa toda a largura do contentor. */
  className?: string
}

export default function CityCard({ name, province, onClick, className }: CityCardProps) {
  const [status, setStatus] = useState<'loading' | 'ok' | 'failed'>('loading')

  // Se a imagem não carregar em 5s, mostra o gradiente de fallback.
  useEffect(() => {
    if (status !== 'loading') return
    const t = setTimeout(() => setStatus((s) => (s === 'loading' ? 'failed' : s)), 5000)
    return () => clearTimeout(t)
  }, [status])

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'group relative block h-32 w-full overflow-hidden rounded-2xl bg-gradient-to-br shadow-md transition-transform hover:scale-[1.02] active:scale-[0.99]',
        cityGradient(name),
        className,
      )}
    >
      {status !== 'failed' && (
        <img
          src={cityImage(name)}
          alt={name}
          loading="lazy"
          onLoad={() => setStatus('ok')}
          onError={() => setStatus('failed')}
          className={cn(
            'h-full w-full object-cover transition-[opacity,transform] duration-300 group-hover:scale-105',
            status === 'ok' ? 'opacity-100' : 'opacity-0',
          )}
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 p-3 text-left text-white">
        <p className="text-sm font-bold leading-tight">{name}</p>
        {province && province !== name && (
          <span className="mt-0.5 flex items-center gap-1 text-[10px] font-medium text-white/80">
            <IconMapPin className="size-3" />
            {province}
          </span>
        )}
      </div>
    </button>
  )
}
