import { boardingApi } from '@/services/operator'
import { useAsyncAction, useAsyncData } from '@/hooks/useAsync'
import type { ValidateQrPayload, WalkInBoardingPayload } from '@/types/operator'

/** POST /boarding/scan — valida + regista o embarque num passo. */
export function useScan() {
  const { run, isLoading, error, reset } = useAsyncAction(
    (payload: ValidateQrPayload) => boardingApi.scan(payload),
    'Não foi possível validar o bilhete.',
  )
  return { scan: run, isLoading, error, reset }
}

/** POST /boarding/board/{booking_id} — embarcar do manifesto sem QR. */
export function useBoardFromManifest() {
  const { run, isLoading, error } = useAsyncAction(
    (bookingId: string) => boardingApi.boardFromManifest(bookingId),
    'Não foi possível registar o embarque.',
  )
  return { board: run, isLoading, error }
}

/** GET /boarding/summary — resumo de embarque de uma viagem. */
export function useBoardingSummary(scheduleId?: string) {
  return useAsyncData(() => boardingApi.getSummary(scheduleId!), `boarding-summary:${scheduleId}`, {
    enabled: Boolean(scheduleId),
    fallbackError: 'Não foi possível carregar o resumo da viagem.',
  })
}

/** GET /boarding/my-sales — total de vendas do operador no dia. */
export function useMySales(date?: string) {
  return useAsyncData(() => boardingApi.getMySales(date), `my-sales:${date ?? 'today'}`, {
    fallbackError: 'Não foi possível carregar as suas vendas.',
  })
}

/** POST /boarding/walk-in — venda + embarque imediato à porta (sem QR). */
export function useWalkInBoarding() {
  const { run, isLoading, error } = useAsyncAction(
    (payload: WalkInBoardingPayload) => boardingApi.walkIn(payload),
    'Não foi possível registar o embarque à porta.',
  )
  return { walkIn: run, isLoading, error }
}
