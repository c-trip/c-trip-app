import { useCallback, useState } from 'react'
import { boardingApi } from '@/services/operator'
import type { SellTicketPayload, SellTicketResponse } from '@/types/operator'

export function useSellTicket() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sell = useCallback(async (payload: SellTicketPayload): Promise<SellTicketResponse | null> => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await boardingApi.sell(payload)
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível vender o bilhete.')
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { isLoading, error, sell }
}