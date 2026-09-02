export interface TripFilters {
  date?: string
  origin?: string
  destination?: string
  maxPrice?: number
}

export function countActiveFilters(f: TripFilters): number {
  return [f.date, f.origin, f.destination, f.maxPrice].filter(
    (v) => v !== undefined && v !== '' && v !== null,
  ).length
}
