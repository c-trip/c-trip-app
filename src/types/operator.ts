export type OperatorPaymentMethod = 'cash' | 'pos' | 'multicaixa_express'

/** Métodos aceites no embarque walk-in (venda à porta). */
export type WalkInPaymentMethod = 'cash' | 'pos'

export type ScheduleStatus = 'scheduled' | 'boarding' | 'departed' | 'cancelled' | string

export interface OperatorSchedule {
  schedule_id: string
  route_id: string
  origin: string
  destination: string
  departure_date: string
  departure_time: string
  /** Preço do lugar (Kz). */
  price: number
  total_seats: number
  available_seats: number
  status: ScheduleStatus
}

export interface SellTicketPayload {
  schedule_id: string
  seat_number: number
  passenger_name: string
  passenger_phone: string
  passenger_id_doc: string
  total_price: number
  payment_method: OperatorPaymentMethod
}

export interface SellTicketResponse {
  booking_id: string
  payment_id: string
  qr_hash: string
  qr_image: string
  passenger_name: string
  passenger_phone?: string | null
  passenger_id_doc?: string | null
  seat_number: number
  origin: string
  destination: string
  departure_date: string
  departure_time: string
  company_name: string
  valid_until: string
}

export interface ReprintQrPayload {
  schedule_id: string
  seat_number: number
}

export interface ReprintQrResponse {
  qr_hash: string
  qr_image: string
  passenger_name: string
  seat_number: number
  booking_id: string
}

/** `/boarding/validate` devolve allowed|already_boarded|invalid; `/boarding/scan` pode devolver `boarded`. */
export type ValidateStatus = 'allowed' | 'boarded' | 'already_boarded' | 'invalid' | string

export interface ValidateQrPayload {
  qr_hash: string
  schedule_id?: string
}

export interface ValidateQrResponse {
  status: ValidateStatus
  passenger: string
  seat_number: number
  destination: string
  first_boarded_at: string
  reason: string
}

export interface RecordBoardingPayload {
  qr_hash: string
}

export interface RecordBoardingResponse {
  boarding_id: string
  boarded_at: string
}

export type ManifestBookingStatus = 'confirmed' | 'cancelled' | 'expired' | 'boarded' | string

/** `?status=all` mostra também canceladas/expiradas; por omissão só `confirmed`. */
export type ManifestFilter = 'confirmed' | 'all'

export interface ManifestItem {
  booking_id: string
  seat: number
  status: ManifestBookingStatus
  passenger?: string | null
  phone?: string | null
  id_doc?: string | null
  boarded?: boolean
  boarded_at?: string | null
}

export interface BoardFromManifestResponse {
  booking_id: string
  status: 'boarded' | 'already_boarded' | string
  passenger: string
  seat: number
  boarded_at: string
}

export interface BoardingSummary {
  schedule_id: string
  departure_date: string
  departure_time: string
  total_seats: number
  tickets_sold: number
  boarded: number
  no_show: number
  walk_ins: number
  revenue_confirmed: number
}

export interface OperatorSalesTotal {
  date: string
  operator_id: string
  count: number
  total: number
}

export interface WalkInBoardingPayload {
  schedule_id: string
  seat_number: number
  passenger_name: string
  passenger_phone?: string
  passenger_id_doc?: string
  total_price: number
  payment_method?: WalkInPaymentMethod
}

export interface WalkInBoardingResponse {
  booking_id: string
  boarding_id: string
  seat_number: number
  passenger_name: string
  passenger_phone?: string | null
  passenger_id_doc?: string | null
  boarded_at: string
}

/* ---------- Frota / tarefas ---------- */

export type FleetTaskStatus = 'pending' | 'in_progress' | 'done'

export interface FleetTask {
  id: string
  title: string
  status: FleetTaskStatus | string
}
