import { create } from 'zustand'
import type { User } from '@/types/auth'
import { authApi } from '@/services/authService'
import { setToken } from '@/services/tokenStore'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  bootstrap: () => Promise<void>
  login: (email: string, password: string) => Promise<void>
  register: (payload: { email: string; name: string; password: string }) => Promise<void>
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  bootstrap: async () => {
    set({ isLoading: true })
    try {
      const user = await authApi.me()
      set({ user, isAuthenticated: true })
    } catch {
      set({ user: null, isAuthenticated: false })
    } finally {
      set({ isLoading: false })
    }
  },

  login: async (email, password) => {
    const { access_token, user } = await authApi.login({ email, password })
    setToken(access_token)
    set({ user, isAuthenticated: true })
  },

  register: async ({ email, name, password }) => {
    await authApi.register({ email, name, password })
  },

  logout: () => {
    setToken(null)
    set({ user: null, isAuthenticated: false })
  },
}))