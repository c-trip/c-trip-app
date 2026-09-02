import { useCallback, useEffect, useState } from 'react'
import { boardingApi } from '@/services/operator'
import type { ManifestItem } from '@/types/operator'

export function useManifest(scheduleId?: string) {
  const [manifest, setManifest] = useState<ManifestItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    if (!scheduleId) return
    try {
      const data = await boardingApi.getManifest(scheduleId)
      setManifest(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível carregar o manifesto.')
    }
  }, [scheduleId])

  useEffect(() => {
    if (!scheduleId) return
    let active = true

    const run = async () => {
      setIsLoading(true)
      try {
        const data = await boardingApi.getManifest(scheduleId)
        if (active) setManifest(data)
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : 'Não foi possível carregar o manifesto.')
      } finally {
        if (active) setIsLoading(false)
      }
    }

    void run()
    return () => {
      active = false
    }
  }, [scheduleId])

  return { manifest, isLoading, error, refetch }
}