import { IconSearch, IconAdjustmentsHorizontal, IconX } from '@tabler/icons-react'

interface SearchCardProps {
  query: string
  onQueryChange: (value: string) => void
  onOpenFilters: () => void
  activeFilterCount?: number
  placeholder?: string
}

export default function SearchCard({
  query,
  onQueryChange,
  onOpenFilters,
  activeFilterCount = 0,
  placeholder = 'Pesquisar por destino ou transportadora',
}: SearchCardProps) {
  return (
    <div className="flex items-center gap-2 font-outfit">
      <div className="relative flex-1">
        <IconSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder={placeholder}
          aria-label="Pesquisar viagens"
          className="h-12 w-full rounded-2xl border border-gray-200 bg-white pl-11 pr-10 text-sm text-gray-800 shadow-sm outline-none transition-colors placeholder:text-gray-400 focus:border-[#1B7A3D]"
        />
        {query && (
          <button
            type="button"
            onClick={() => onQueryChange('')}
            aria-label="Limpar pesquisa"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <IconX className="size-4" />
          </button>
        )}
      </div>

      <button
        type="button"
        onClick={onOpenFilters}
        aria-label="Filtros"
        className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-gray-200 bg-white shadow-sm transition-colors hover:border-[#1B7A3D]"
      >
        <IconAdjustmentsHorizontal className="size-5 text-[#1B7A3D]" />
        {activeFilterCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#1B7A3D] px-1 text-[10px] font-bold text-white">
            {activeFilterCount}
          </span>
        )}
      </button>
    </div>
  )
}
