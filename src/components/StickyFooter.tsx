import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface StickyFooterProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode
}

export default function StickyFooter({ className, children, ...props }: StickyFooterProps) {
  return (
    <footer
      className={cn(
        'sticky bottom-0 z-10 flex w-full flex-col items-center gap-3 border-t-2 border-[#E5E7EB] bg-white px-5 py-4',
        className,
      )}
      {...props}
    >
      {children}
    </footer>
  )
}