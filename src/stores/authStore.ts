import { create } from 'zustand'
import type { User } from '@/types/auth'
import { authApi } from '@/services/authService'
import { setToken, getToken } from '@/services/tokenStore'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  hasBootstrapped: boolean
  bootstrap: () => Promise<void>
  login: (email: string, password: string) => Promise<void>
  register: (payload: { email: string; name: string; password: string }) => Promise<void>
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  hasBootstrapped: false,

  bootstrap: async () => {
    if (!getToken()) {
      set({ hasBootstrapped: true, isLoading: false })
      return
    }
    set({ isLoading: true })
    try {
      const user = await authApi.me()
      set({ user, isAuthenticated: true })
    } catch {
      set({ user: null, isAuthenticated: false })
    } finally {
      set({ isLoading: false, hasBootstrapped: true })
    }
  },

  login: async (email, password) => {
    const { access_token, user } = await authApi.login({ email, password })
    setToken(access_token)
    set({ user, isAuthenticated: true, hasBootstrapped: true })
  },

  register: async ({ email, name, password }) => {
    await authApi.register({ email, name, password })
  },

  logout: () => {
    setToken(null)
    set({ user: null, isAuthenticated: false })
  },
}))