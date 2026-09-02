import { useAuthStore } from '@/stores/authStore'

export function useAuth() {
  const {
    user,
    isAuthenticated,
    isLoading,
    hasBootstrapped,
    bootstrap,
    login,
    register,
    logout,
  } = useAuthStore()

  return {
    user,
    isAuthenticated,
    isLoading,
    hasBootstrapped,
    bootstrap,
    login,
    register,
    logout,
  }
}