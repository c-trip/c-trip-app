import { useState } from 'react'
import { authApi } from '@/services/authService'

export function useChangePassword() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async (currentPassword: string, newPassword: string) => {
    setLoading(true)
    setError(null)
    try {
      await authApi.changePassword({
        current_password: currentPassword,
        new_password: newPassword,
      })
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocorreu um erro ao alterar a palavra-passe.')
      return false
    } finally {
      setLoading(false)
    }
  }

  return { loading, error, submit }
}