import { useEffect, useState } from 'react'
import { IconX } from '@tabler/icons-react'
import { useCities } from '@/hooks/catalog/useCatalog'
import type { TripFilters } from '@/lib/tripFilters'
import FieldSelect from '@/components/ui/FieldSelect'
import FieldDate from '@/components/ui/FieldDate'

interface TripFilterDialogProps {
  value: TripFilters
  onApply: (filters: TripFilters) => void
  onClose: () => void
}

type OpenField = 'date' | 'origin' | 'destination' | null

function startOfToday(): Date {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}

/**
 * Modal centrado com os filtros de pesquisa de viagens.
 * Renderizar condicionalmente pelo pai (`{open && <TripFilterDialog .../>}`).
 */
export default function TripFilterDialog({ value, onApply, onClose }: TripFilterDialogProps) {
  const { data: cities, isLoading } = useCities()
  const [draft, setDraft] = useState<TripFilters>(value)
  const [openField, setOpenField] = useState<OpenField>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (openField) setOpenField(null)
        else onClose()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose, openField])

  const cityOptions = (cities ?? []).map((c) => c.name).sort((a, b) => a.localeCompare(b, 'pt'))

  const set = <K extends keyof TripFilters>(key: K, val: TripFilters[K]) =>
    setDraft((d) => ({ ...d, [key]: val || undefined }))

  const toggle = (field: Exclude<OpenField, null>) => (open: boolean) =>
    setOpenField(open ? field : null)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-6 font-outfit"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Filtros de pesquisa"
        onClick={(e) => e.stopPropagation()}
        className="max-h-[85vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6 shadow-xl animate-scale-in"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#111827]">Filtrar viagens</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200"
          >
            <IconX className="size-4 text-gray-600" />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <FieldDate
            label="Data"
            value={draft.date}
            onChange={(v) => set('date', v)}
            fromDate={startOfToday()}
            isOpen={openField === 'date'}
            onOpenChange={toggle('date')}
          />

          <div className="flex gap-3">
            <div className="flex-1">
              <FieldSelect
                label="Origem"
                value={draft.origin ?? ''}
                onChange={(v) => set('origin', v)}
                options={cityOptions}
                disabled={isLoading}
                isOpen={openField === 'origin'}
                onOpenChange={toggle('origin')}
              />
            </div>
            <div className="flex-1">
              <FieldSelect
                label="Destino"
                value={draft.destination ?? ''}
                onChange={(v) => set('destination', v)}
                options={cityOptions}
                disabled={isLoading}
                isOpen={openField === 'destination'}
                onOpenChange={toggle('destination')}
              />
            </div>
          </div>

          <div>
            <label htmlFor="filter-price" className="mb-1.5 block text-xs font-bold text-[#6B7280] uppercase tracking-wide">
              Preço máximo (Kz)
            </label>
            <input
              id="filter-price"
              type="number"
              inputMode="numeric"
              min={0}
              step={500}
              value={draft.maxPrice ?? ''}
              onChange={(e) => set('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
              placeholder="Sem limite"
              className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm text-gray-800 outline-none focus:border-[#1B7A3D]"
            />
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={() => {
              onApply({})
              onClose()
            }}
            className="flex-1 h-11 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-[#4B5563] hover:bg-gray-50"
          >
            Limpar
          </button>
          <button
            type="button"
            onClick={() => {
              onApply(draft)
              onClose()
            }}
            className="flex-1 h-11 rounded-xl bg-gradient-to-r from-green-gradient-start to-green-gradient-end text-sm font-bold text-white hover:opacity-90"
          >
            Aplicar
          </button>
        </div>
      </div>
    </div>
  )
}
