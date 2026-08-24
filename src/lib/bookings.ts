import type { Booking, BookingStatus } from '@/types'

const STORAGE_KEY = 'c_trip_bookings'

const SEED_KEY = 'c_trip_bookings_seeded'

const SEED_BOOKINGS: Booking[] = [
  {
    id: 'BK-1001',
    scheduleId: 'macon-future-1',
    seat: 3,
    seatLabel: '1C',
    passengerName: 'João Silva',
    passengerBI: '001234567LA045',
    passengerPhone: '923 456 789',
    status: 'confirmada',
    price: '3 500 Kz',
    createdAt: Date.now() - 86400000,
    paymentMethod: 'mcx',
  },
  {
    id: 'BK-1002',
    scheduleId: 'angorreal-future-1',
    seat: 7,
    seatLabel: '2C',
    passengerName: 'Maria Fernandes',
    passengerBI: '009876543LA012',
    passengerPhone: '912 345 678',
    status: 'pendente',
    price: '5 000 Kz',
    createdAt: Date.now() - 43200000,
    paymentMethod: 'mcx',
  },
  {
    id: 'BK-1003',
    scheduleId: 'labarca-1',
    seat: 11,
    seatLabel: '3C',
    passengerName: 'Carlos Mendes',
    passengerBI: '004567891LA078',
    passengerPhone: '934 567 890',
    status: 'concluida',
    price: '4 000 Kz',
    createdAt: Date.now() - 604800000,
    paymentMethod: 'mcx',
  },
  {
    id: 'BK-1004',
    scheduleId: 'macon-2',
    seat: 5,
    seatLabel: '2A',
    passengerName: 'Ana Neto',
    passengerBI: '003216549LA034',
    passengerPhone: '945 678 901',
    status: 'cancelada',
    price: '2 800 Kz',
    createdAt: Date.now() - 172800000,
    paymentMethod: 'mcx',
  },
  {
    id: 'BK-1005',
    scheduleId: 'macon-3',
    seat: 9,
    seatLabel: '3A',
    passengerName: 'Pedro Santos',
    passengerBI: '007891234LA056',
    passengerPhone: '956 789 012',
    status: 'concluida',
    price: '4 500 Kz',
    createdAt: Date.now() - 259200000,
    paymentMethod: 'mcx',
  },
]

const VALID_STATUS: readonly BookingStatus[] = ['confirmada', 'pendente', 'cancelada', 'concluida']

function isBooking(value: unknown): value is Booking {
  if (typeof value !== 'object' || value === null) return false
  const b = value as Record<string, unknown>
  return (
    typeof b.id === 'string' &&
    typeof b.scheduleId === 'string' &&
    typeof b.seat === 'number' &&
    typeof b.createdAt === 'number' &&
    VALID_STATUS.includes(b.status as BookingStatus)
  )
}

function seedIfEmpty(): void {
  try {
    if (localStorage.getItem(SEED_KEY)) return
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) return
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_BOOKINGS))
    localStorage.setItem(SEED_KEY, '1')
  } catch {
    /* ignore */
  }
}

seedIfEmpty()

export function getBookings(): Booking[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(isBooking)
  } catch {
    return []
  }
}

export function getBookingById(id: string): Booking | undefined {
  return getBookings().find((b) => b.id === id)
}

export function saveBooking(booking: Booking): void {
  const bookings = getBookings()
  bookings.push(booking)
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings))
  } catch {
    /* localStorage may be full or unavailable */
  }
}

export function updateBookingStatus(id: string, status: BookingStatus): void {
  const bookings = getBookings()
  const idx = bookings.findIndex((b) => b.id === id)
  if (idx === -1) return
  bookings[idx] = { ...bookings[idx], status }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings))
  } catch {
    /* ignore */
  }
}

export function deleteBooking(id: string): void {
  const bookings = getBookings().filter((b) => b.id !== id)
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings))
  } catch {
    /* ignore */
  }
}
