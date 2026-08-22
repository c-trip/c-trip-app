const HOLD_MINUTES = 10
export const HOLD_MS = HOLD_MINUTES * 60 * 1000
export const HOLD_TOTAL_SECONDS = HOLD_MINUTES * 60

export function getHeldKey(scheduleId: string): string {
  return `held_seats_${scheduleId}`
}

export function readTimestamp(key: string): number | null {
  const raw = localStorage.getItem(key)
  if (!raw) return null
  const ts = Number(raw)
  const now = Date.now()
  if (!Number.isFinite(ts) || ts > now || ts <= now - HOLD_MS) return null
  return ts
}

export function getHeldMap(scheduleId: string): Record<number, number> {
  const raw = localStorage.getItem(getHeldKey(scheduleId))
  if (!raw) return {}
  try {
    const parsed = JSON.parse(raw)
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) return {}
    const now = Date.now()
    const result: Record<number, number> = {}
    for (const [k, v] of Object.entries(parsed)) {
      const seat = Number(k)
      const ts = Number(v)
      if (Number.isInteger(seat) && Number.isFinite(ts) && ts > now - HOLD_MS && ts <= now) {
        result[seat] = ts
      }
    }
    return result
  } catch { return {} }
}

export function addHeldSeat(scheduleId: string, seat: number, ts: number): void {
  const map = getHeldMap(scheduleId)
  map[seat] = ts
  localStorage.setItem(getHeldKey(scheduleId), JSON.stringify(map))
}

export function removeHeldSeat(scheduleId: string, seat: number): void {
  const map = getHeldMap(scheduleId)
  delete map[seat]
  if (Object.keys(map).length === 0) {
    localStorage.removeItem(getHeldKey(scheduleId))
  } else {
    localStorage.setItem(getHeldKey(scheduleId), JSON.stringify(map))
  }
}

export function readActiveHeldSeats(scheduleId: string): number[] {
  return Object.keys(getHeldMap(scheduleId)).map(Number)
}
