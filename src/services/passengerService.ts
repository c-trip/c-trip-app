import { http } from './http'
import type {
  BookingDetail,
  BookingItem,
  CancelBookingResponse,
  GenerateQrPayload,
  InitiatePaymentPayload,
  InitiatePaymentResponse,
  NotificationItem,
  PassengerProfile,
  PaymentItem,
  PaymentStatusResponse,
  QrResponse,
  UpdateProfilePayload,
  UpdateProfileResponse,
} from '@/types/passenger'

/** Reservas do passageiro autenticado. */
export const bookingApi = {
  async list(): Promise<BookingItem[]> {
    const { data } = await http.get<BookingItem[]>('/bookings/')
    return data
  },

  async get(bookingId: string): Promise<BookingDetail> {
    const { data } = await http.get<BookingDetail>(`/bookings/${bookingId}`)
    return data
  },

  async cancel(bookingId: string): Promise<CancelBookingResponse> {
    const { data } = await http.post<CancelBookingResponse>('/bookings/cancel', {
      booking_id: bookingId,
    })
    return data
  },
}

/** Pagamentos do passageiro autenticado. */
export const paymentApi = {
  async list(): Promise<PaymentItem[]> {
    const { data } = await http.get<PaymentItem[]>('/payments/')
    return data
  },

  /** Reserva o lugar e inicia o pagamento num único passo. */
  async initiate(payload: InitiatePaymentPayload): Promise<InitiatePaymentResponse> {
    const { data } = await http.post<InitiatePaymentResponse>('/payments/initiate', payload)
    return data
  },

  async statusByBooking(bookingId: string): Promise<PaymentStatusResponse> {
    const { data } = await http.get<PaymentStatusResponse>(`/payments/booking/${bookingId}`)
    return data
  },
}

/** QR code de embarque (reserva confirmada). */
export const qrApi = {
  async generate(payload: GenerateQrPayload): Promise<QrResponse> {
    const { data } = await http.post<QrResponse>('/qr/generate', payload)
    return data
  },
}

/** Notificações do passageiro autenticado. */
export const notificationApi = {
  async list(): Promise<NotificationItem[]> {
    const { data } = await http.get<NotificationItem[]>('/notifications/')
    return data
  },

  async markRead(notificationId: string): Promise<void> {
    await http.patch(`/notifications/${notificationId}/read`)
  },
}

/** Perfil de passageiro. */
export const passengerApi = {
  async get(userId: string): Promise<PassengerProfile> {
    const { data } = await http.get<PassengerProfile>(`/passengers/${userId}`)
    return data
  },

  async updateProfile(payload: UpdateProfilePayload): Promise<UpdateProfileResponse> {
    const { data } = await http.patch<UpdateProfileResponse>('/passengers/profile', payload)
    return data
  },
}
