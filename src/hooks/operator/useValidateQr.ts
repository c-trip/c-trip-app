import { useCallback, useState } from 'react'
import { boardingApi } from '@/services/operator'
import type { ValidateQrPayload, ValidateQrResponse } from '@/types/operator'

export function useValidateQr() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const validate = useCallback(
    async (payload: ValidateQrPayload): Promise<ValidateQrResponse | null> => {
      setIsLoading(true)
      setError(null)
      try {
        const data = await boardingApi.validateQr(payload)
        return data
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Não foi possível validar o bilhete.')
        return null
      } finally {
        setIsLoading(false)
      }
    },
    [],
  )

  return { isLoading, error, validate }
}