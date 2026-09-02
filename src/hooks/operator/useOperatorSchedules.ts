import { useCallback, useEffect, useState } from 'react'
import { boardingApi } from '@/services/operator'
import type { OperatorSchedule } from '@/types/operator'

export function useOperatorSchedules(date?: string) {
  const [schedules, setSchedules] = useState<OperatorSchedule[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(
    async (queryDate?: string) => {
      try {
        const data = await boardingApi.getSchedules(queryDate ?? date)
        setSchedules(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Não foi possível carregar as viagens.')
      }
    },
    [date],
  )

  useEffect(() => {
    let active = true

    const run = async () => {
      try {
        const data = await boardingApi.getSchedules(date)
        if (active) setSchedules(data)
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : 'Não foi possível carregar as viagens.')
      } finally {
        if (active) setIsLoading(false)
      }
    }

    void run()
    return () => {
      active = false
    }
  }, [date])

  return { schedules, isLoading, error, refetch }
}