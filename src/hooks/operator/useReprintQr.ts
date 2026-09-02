import { useCallback, useState } from 'react'
import { boardingApi } from '@/services/operator'
import type { ReprintQrPayload, ReprintQrResponse } from '@/types/operator'

export function useReprintQr() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const reprint = useCallback(
    async (payload: ReprintQrPayload): Promise<ReprintQrResponse | null> => {
      setIsLoading(true)
      setError(null)
      try {
        const data = await boardingApi.reprintQr(payload)
        return data
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Não foi possível reimprimir o bilhete.')
        return null
      } finally {
        setIsLoading(false)
      }
    },
    [],
  )

  return { isLoading, error, reprint }
}