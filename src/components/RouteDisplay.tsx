import { IconArrowRight } from '@tabler/icons-react'

interface RouteDisplayProps {
  origin?: string
  destination?: string
  route?: string
  className?: string
  iconClassName?: string
}

export default function RouteDisplay({
  origin,
  destination,
  route,
  className = '',
  iconClassName = 'size-4',
}: RouteDisplayProps) {
  const parts = (route ?? '').split(/\s*→\s*/).filter(Boolean)
  const from = origin ?? parts[0]
  const to = destination ?? parts[1]

  if (!from || !to) {
    return <span className={className}>{route || origin || destination}</span>
  }

  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      {from}
      <IconArrowRight className={`shrink-0 ${iconClassName}`} aria-hidden="true" />
      {to}
    </span>
  )
}