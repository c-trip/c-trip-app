import { useEffect, useRef } from 'react'
import { format, parse } from 'date-fns'
import { pt } from 'date-fns/locale/pt'
import { IconCalendar, IconX } from '@tabler/icons-react'
import { Calendar } from '@/components/ui/calendar'

interface FieldDateProps {
  label: string
  value?: string
  onChange: (value: string | undefined) => void
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  fromDate?: Date
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

/** Campo de data customizado — abre o Calendar (react-day-picker) inline. */
export default function FieldDate({
  label,
  value,
  onChange,
  isOpen,
  onOpenChange,
  fromDate,
}: FieldDateProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onOpenChange(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [isOpen, onOpenChange])

  const selected = value ? parse(value, 'yyyy-MM-dd', new Date()) : undefined
  const label_ = selected
    ? capitalize(format(selected, "EEEE, d 'de' MMMM", { locale: pt }))
    : 'Qualquer data'

  return (
    <div ref={ref}>
      <span className="mb-1.5 block text-xs font-bold text-[#6B7280] uppercase tracking-wide">{label}</span>
      <button
        type="button"
        onClick={() => onOpenChange(!isOpen)}
        className={`flex h-11 w-full items-center gap-2 rounded-xl border bg-gray-50 px-3 text-sm transition-colors ${
          isOpen ? 'border-[#1B7A3D]' : 'border-gray-200'
        } ${selected ? 'text-gray-800' : 'text-gray-400'}`}
      >
        <IconCalendar className="size-4 shrink-0 text-[#1B7A3D]" />
        <span className="flex-1 truncate text-left">{label_}</span>
        {selected && (
          <span
            role="button"
            tabIndex={0}
            aria-label="Limpar data"
            onClick={(e) => {
              e.stopPropagation()
              onChange(undefined)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                e.stopPropagation()
                onChange(undefined)
              }
            }}
            className="rounded-full p-0.5 text-gray-400 hover:bg-gray-200 hover:text-gray-600"
          >
            <IconX className="size-3.5" />
          </span>
        )}
      </button>

      {isOpen && (
        <div className="mt-1.5 rounded-xl border border-gray-200 bg-white p-2 shadow-lg animate-scale-in">
          <Calendar
            mode="single"
            locale={pt}
            selected={selected}
            defaultMonth={selected ?? fromDate ?? new Date()}
            disabled={fromDate ? { before: fromDate } : undefined}
            showOutsideDays={false}
            className="mx-auto [--cell-size:2rem]"
            formatters={{
              formatCaption: (date) => capitalize(format(date, 'MMMM yyyy', { locale: pt })),
            }}
            onSelect={(day) => {
              if (day) onChange(format(day, 'yyyy-MM-dd'))
              onOpenChange(false)
            }}
          />
        </div>
      )}
    </div>
  )
}
