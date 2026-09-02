export type OperatorPaymentMethod = 'cash' | 'pos' | 'multicaixa_express'

export type ScheduleStatus = 'scheduled' | 'boarding' | 'departed' | string

export interface OperatorSchedule {
  schedule_id: string
  origin: string
  destination: string
  departure_date: string
  departure_time: string
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

export type ValidateStatus = 'allowed' | 'already_boarded' | 'invalid'

export interface ValidateQrPayload {
  qr_hash: string
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

export type ManifestBookingStatus = 'confirmed' | 'cancelled' | 'boarded' | string

export interface ManifestItem {
  booking_id: string
  seat: number
  status: ManifestBookingStatus
}