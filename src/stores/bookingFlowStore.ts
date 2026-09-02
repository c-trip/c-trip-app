import { create } from 'zustand'

const STORAGE_KEY = 'c_trip_booking_flow'

/** Viagem escolhida na pesquisa — a API não a devolve nos passos seguintes do funil. */
export interface SelectedTrip {
  scheduleId: string
  routeId?: string
  company?: string
  origin: string
  destination: string
  departureDate?: string
  departureTime?: string
  /** Preço em Kz. */
  price: number
  availableSeats?: number
}

/** Dados devolvidos por POST /payments/initiate, para as telas de pagamento. */
export interface PaymentInfo {
  bookingId: string
  paymentId: string
  amount: number
  reference?: string | null
  entity?: string | null
  gateway?: string | null
  expiresAt?: string | null
}

interface BookingFlowState {
  trip: SelectedTrip | null
  seatNumber: number | null
  payment: PaymentInfo | null
  setTrip: (trip: SelectedTrip) => void
  setSeat: (seat: number | null) => void
  setPayment: (payment: PaymentInfo) => void
  reset: () => void
}

interface PersistedShape {
  trip: SelectedTrip | null
  seatNumber: number | null
  payment: PaymentInfo | null
}

function read(): PersistedShape {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return { trip: null, seatNumber: null, payment: null }
    const parsed = JSON.parse(raw) as Partial<PersistedShape>
    return {
      trip: parsed.trip ?? null,
      seatNumber: typeof parsed.seatNumber === 'number' ? parsed.seatNumber : null,
      payment: parsed.payment ?? null,
    }
  } catch {
    return { trip: null, seatNumber: null, payment: null }
  }
}

function write(state: PersistedShape): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    /* sessionStorage indisponível */
  }
}

const initial = read()

export const useBookingFlowStore = create<BookingFlowState>((set, get) => ({
  trip: initial.trip,
  seatNumber: initial.seatNumber,
  payment: initial.payment,

  setTrip: (trip) => {
    set({ trip, seatNumber: null, payment: null })
    write({ trip, seatNumber: null, payment: null })
  },

  setSeat: (seatNumber) => {
    set({ seatNumber })
    write({ trip: get().trip, seatNumber, payment: get().payment })
  },

  setPayment: (payment) => {
    set({ payment })
    write({ trip: get().trip, seatNumber: get().seatNumber, payment })
  },

  reset: () => {
    set({ trip: null, seatNumber: null, payment: null })
    write({ trip: null, seatNumber: null, payment: null })
  },
}))
