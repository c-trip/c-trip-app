import { useCallback } from 'react'
import {
  bookingApi,
  notificationApi,
  passengerApi,
  paymentApi,
  qrApi,
} from '@/services/passengerService'
import { useAsyncAction, useAsyncData } from '@/hooks/useAsync'
import type {
  GenerateQrPayload,
  InitiatePaymentPayload,
  UpdateProfilePayload,
} from '@/types/passenger'

/* ---------- Reservas ---------- */

export function useBookings() {
  return useAsyncData(() => bookingApi.list(), 'bookings', {
    fallbackError: 'Não foi possível carregar as suas reservas.',
  })
}

export function useBooking(bookingId?: string) {
  return useAsyncData(() => bookingApi.get(bookingId!), `booking:${bookingId}`, {
    enabled: Boolean(bookingId),
    fallbackError: 'Não foi possível carregar a reserva.',
  })
}

export function useCancelBooking() {
  const { run, isLoading, error } = useAsyncAction(
    (bookingId: string) => bookingApi.cancel(bookingId),
    'Não foi possível cancelar a reserva.',
  )
  return { cancel: run, isLoading, error }
}

/* ---------- Pagamentos ---------- */

export function usePayments() {
  return useAsyncData(() => paymentApi.list(), 'payments', {
    fallbackError: 'Não foi possível carregar os seus pagamentos.',
  })
}

export function useInitiatePayment() {
  const { run, isLoading, error } = useAsyncAction(
    (payload: InitiatePaymentPayload) => paymentApi.initiate(payload),
    'Não foi possível iniciar o pagamento.',
  )
  return { initiate: run, isLoading, error }
}

/** Status do pagamento de uma reserva; usar `refetch` para polling. */
export function usePaymentStatus(bookingId?: string) {
  return useAsyncData(
    () => paymentApi.statusByBooking(bookingId!),
    `payment-status:${bookingId}`,
    {
      enabled: Boolean(bookingId),
      fallbackError: 'Não foi possível obter o estado do pagamento.',
    },
  )
}

/* ---------- QR ---------- */

export function useGenerateQr() {
  const { run, isLoading, error } = useAsyncAction(
    (payload: GenerateQrPayload) => qrApi.generate(payload),
    'Não foi possível gerar o QR code.',
  )
  return { generate: run, isLoading, error }
}

/* ---------- Notificações ---------- */

export function useNotifications() {
  const query = useAsyncData(() => notificationApi.list(), 'notifications', {
    fallbackError: 'Não foi possível carregar as notificações.',
  })

  const { refetch } = query
  const markRead = useCallback(
    async (notificationId: string) => {
      await notificationApi.markRead(notificationId)
      await refetch()
    },
    [refetch],
  )

  const unreadCount = (query.data ?? []).filter((n) => !n.is_read).length

  return { ...query, markRead, unreadCount }
}

/* ---------- Perfil ---------- */

export function usePassengerProfile(userId?: string) {
  return useAsyncData(() => passengerApi.get(userId!), `passenger:${userId}`, {
    enabled: Boolean(userId),
    fallbackError: 'Não foi possível carregar o perfil.',
  })
}

export function useUpdateProfile() {
  const { run, isLoading, error } = useAsyncAction(
    (payload: UpdateProfilePayload) => passengerApi.updateProfile(payload),
    'Não foi possível atualizar o perfil.',
  )
  return { updateProfile: run, isLoading, error }
}
