import { useEffect, useState } from 'react'
import { authApi } from '@/services/authService'
import type { User } from '@/types/auth'

export function useProfile() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    const load = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const data = await authApi.me()
        if (active) setUser(data)
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : 'Não foi possível carregar o perfil.')
      } finally {
        if (active) setIsLoading(false)
      }
    }

    load()
    return () => {
      active = false
    }
  }, [])

  return { user, isLoading, error }
}