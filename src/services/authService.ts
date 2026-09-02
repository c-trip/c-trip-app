import { http } from './http'
import type {
  ChangePasswordPayload,
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  RegisterResponse,
  User,
} from '@/types/auth'

export const authApi = {
  async login(payload: LoginPayload): Promise<LoginResponse> {
    const { data } = await http.post<LoginResponse>('/auth/login', payload)
    return data
  },

  async register(payload: RegisterPayload): Promise<RegisterResponse> {
    const { data } = await http.post<RegisterResponse>('/auth/register', payload)
    return data
  },

  async me(): Promise<User> {
    const { data } = await http.get<User>('/auth/me')
    return data
  },

  async changePassword(payload: ChangePasswordPayload): Promise<string> {
    const { data } = await http.post<string>('/auth/change-password', payload)
    return data
  },
}