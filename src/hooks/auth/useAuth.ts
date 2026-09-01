import { useAuthStore } from '@/stores/authStore'

export function useAuth() {
  const { user, isAuthenticated, isLoading, bootstrap, login, register, logout } = useAuthStore()

  return { user, isAuthenticated, isLoading, bootstrap, login, register, logout }
}