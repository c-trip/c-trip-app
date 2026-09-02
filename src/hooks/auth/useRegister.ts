import { useState } from 'react'
import { useAuth } from './useAuth'

export function useRegister() {
  const { register } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async (payload: { email: string; name: string; password: string }) => {
    setLoading(true)
    setError(null)
    try {
      await register(payload)
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocorreu um erro ao criar a conta.')
      return false
    } finally {
      setLoading(false)
    }
  }

  return { loading, error, submit }
}