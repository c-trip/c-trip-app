import type { ReactNode } from 'react'
import { IconArrowLeft } from '@tabler/icons-react'
import { cn } from '@/lib/utils'

interface PageHeaderProps {
  title: ReactNode
  subtitle?: ReactNode
  onBack?: () => void
  backLabel?: string
  centerTitle?: boolean
  className?: string
  titleClassName?: string
  subtitleClassName?: string
  children?: ReactNode
}

export default function PageHeader({
  title,
  subtitle,
  onBack,
  backLabel = 'Voltar',
  centerTitle = false,
  className,
  titleClassName,
  subtitleClassName,
  children,
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        'sticky top-0 z-20 border-b border-gray-200 bg-white px-4 py-4',
        className,
      )}
    >
      <div className={cn('flex items-center gap-3', centerTitle && 'relative justify-center')}>
        {onBack && (
          <button
            onClick={onBack}
            aria-label={backLabel}
            className={cn(
              'flex h-10 w-10 shrink-0 items-center justify-center rounded-full  transition-colors hover:bg-gray-200',
              centerTitle && 'absolute left-0 top-1/2 -translate-y-1/2',
            )}
          >
            <IconArrowLeft className="size-6 text-gray-700" />
          </button>
        )}

        <div className={cn('flex flex-col', centerTitle ? 'text-center' : 'flex-1')}>
          <h1
            className={cn(
              'text-lg font-bold text-[#111827]',
              titleClassName,
            )}
          >
            {title}
          </h1>
          {subtitle && (
            <div className={cn('text-xs text-gray-400', subtitleClassName)}>
              {subtitle}
            </div>
          )}
        </div>
      </div>

      {children}
    </header>
  )
}