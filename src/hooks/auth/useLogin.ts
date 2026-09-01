import { useState } from 'react'
import { useAuth } from './useAuth'

export function useLogin() {
  const { login } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async (email: string, password: string) => {
    setLoading(true)
    setError(null)
    try {
      await login(email, password)
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocorreu um erro ao entrar.')
      return false
    } finally {
      setLoading(false)
    }
  }

  return { loading, error, submit }
}