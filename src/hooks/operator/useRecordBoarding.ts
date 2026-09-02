import { useCallback, useState } from 'react'
import { boardingApi } from '@/services/operator'
import type { RecordBoardingPayload, RecordBoardingResponse } from '@/types/operator'

export function useRecordBoarding() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const record = useCallback(
    async (payload: RecordBoardingPayload): Promise<RecordBoardingResponse | null> => {
      setIsLoading(true)
      setError(null)
      try {
        const data = await boardingApi.recordBoarding(payload)
        return data
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Não foi possível registar o embarque.')
        return null
      } finally {
        setIsLoading(false)
      }
    },
    [],
  )

  return { isLoading, error, record }
}