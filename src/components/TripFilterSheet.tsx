import { useEffect, useState } from 'react'
import { IconX } from '@tabler/icons-react'
import { useCities } from '@/hooks/catalog/useCatalog'
import type { TripFilters } from '@/lib/tripFilters'

interface TripFilterSheetProps {
  value: TripFilters
  onApply: (filters: TripFilters) => void
  onClose: () => void
}

export default function TripFilterSheet({ value, onApply, onClose }: TripFilterSheetProps) {
  const { data: cities, isLoading } = useCities()
  const [draft, setDraft] = useState<TripFilters>(value)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  const cityOptions = (cities ?? []).map((c) => c.name).sort((a, b) => a.localeCompare(b, 'pt'))

  const set = <K extends keyof TripFilters>(key: K, val: TripFilters[K]) =>
    setDraft((d) => ({ ...d, [key]: val || undefined }))

  const selectClass =
    'w-full h-11 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm text-gray-800 outline-none focus:border-green-500'

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Filtros de pesquisa"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-t-3xl bg-white p-6 pb-8 font-outfit shadow-xl animate-slide-up"
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
          <div>
            <label htmlFor="filter-date" className="mb-1.5 block text-xs font-bold text-[#6B7280] uppercase tracking-wide">
              Data
            </label>
            <input
              id="filter-date"
              type="date"
              value={draft.date ?? ''}
              onChange={(e) => set('date', e.target.value)}
              className={selectClass}
            />
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label htmlFor="filter-origin" className="mb-1.5 block text-xs font-bold text-[#6B7280] uppercase tracking-wide">
                Origem
              </label>
              <select
                id="filter-origin"
                value={draft.origin ?? ''}
                disabled={isLoading}
                onChange={(e) => set('origin', e.target.value)}
                className={selectClass}
              >
                <option value="">Qualquer</option>
                {cityOptions.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label htmlFor="filter-destination" className="mb-1.5 block text-xs font-bold text-[#6B7280] uppercase tracking-wide">
                Destino
              </label>
              <select
                id="filter-destination"
                value={draft.destination ?? ''}
                disabled={isLoading}
                onChange={(e) => set('destination', e.target.value)}
                className={selectClass}
              >
                <option value="">Qualquer</option>
                {cityOptions.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
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
              className={selectClass}
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
            className="flex-1 h-12 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-[#4B5563] hover:bg-gray-50"
          >
            Limpar
          </button>
          <button
            type="button"
            onClick={() => {
              onApply(draft)
              onClose()
            }}
            className="flex-1 h-12 rounded-xl bg-gradient-to-r from-green-gradient-start to-green-gradient-end text-sm font-bold text-white hover:opacity-90"
          >
            Aplicar
          </button>
        </div>
      </div>
    </div>
  )
}
