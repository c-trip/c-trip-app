import { http } from './http'
import type {
  ChangePasswordPayload,
  GoogleAuthPayload,
  LoginPayload,
  LoginResponse,
  MyPermissionsResponse,
  RegisterPayload,
  RegisterResponse,
  User,
} from '@/types/auth'

export const authApi = {
  async login(payload: LoginPayload): Promise<LoginResponse> {
    const { data } = await http.post<LoginResponse>('/auth/login', payload)
    return data
  },

  async google(payload: GoogleAuthPayload): Promise<LoginResponse> {
    const { data } = await http.post<LoginResponse>('/auth/google', payload)
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

  async myPermissions(): Promise<MyPermissionsResponse> {
    const { data } = await http.get<MyPermissionsResponse>('/auth/my-permissions')
    return data
  },
}