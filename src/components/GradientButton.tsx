import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

export const FOOTER_GRADIENT = 'linear-gradient(90deg, #6B9E8C 0%, #3A6356 100%)'

interface GradientButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode
}

export default function GradientButton({ className, children, ...props }: GradientButtonProps) {
  return (
    <button
      className={cn(
        'flex h-12 w-full items-center justify-center gap-2 rounded-xl text-base font-semibold text-white',
        'transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      style={props.style ?? { background: FOOTER_GRADIENT }}
      {...props}
    >
      {children}
    </button>
  )
}