// Tipos da API do passageiro autenticado (tags "Passenger" / "Authentication").

export type BookingApiStatus =
  | 'pending'
  | 'confirmed'
  | 'cancelled'
  | 'boarded'
  | 'completed'
  | string

export interface BookingItem {
  booking_id: string
  schedule_id: string
  seat_number: number
  status: BookingApiStatus
  total_price: number
  created_at: string
}

export interface BookingDetail extends BookingItem {
  cancelled_at?: string | null
  passenger_id?: string | null
  guest_name?: string | null
  guest_phone?: string | null
}

export interface CancelBookingResponse {
  booking_id: string
  status: BookingApiStatus
}

export type PaymentApiStatus = 'pending' | 'confirmed' | 'failed' | 'cancelled' | string

export type PaymentMethodApi = 'cash' | 'pos' | 'multicaixa_express' | string

export interface PaymentItem {
  payment_id: string
  booking_id: string
  amount: number
  method: PaymentMethodApi
  status: PaymentApiStatus
  created_at: string
}

export interface InitiatePaymentPayload {
  schedule_id: string
  seat_number: number
  amount: number
  method?: PaymentMethodApi
}

export interface InitiatePaymentResponse {
  booking_id: string
  payment_id: string
  seat_number: number
  status: PaymentApiStatus
  amount: number
  gateway?: string | null
  reference?: string | null
  entity?: string | null
  expires_at?: string | null
}

export interface PaymentStatusResponse {
  status: PaymentApiStatus
  payment_id?: string | null
  amount?: number | null
}

export interface GenerateQrPayload {
  schedule_id: string
  seat_number: number
}

export interface QrResponse {
  qr_id: string
  qr_hash: string
  status: string
}

export interface PassengerProfile {
  id: string
  email: string
  name: string
  role: string
  created_at: string
}

export interface UpdateProfilePayload {
  name?: string | null
  phone?: string | null
  id_document?: string | null
}

export interface UpdateProfileResponse {
  id: string
  name: string
  phone?: string | null
  id_document?: string | null
}

export interface NotificationItem {
  id: string
  title: string
  message: string
  is_read: boolean
  created_at: string
}
