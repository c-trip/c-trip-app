export interface User {
  id: string
  email: string
  name: string
  role: string
}

export interface LoginResponse {
  access_token: string
  token_type: string
  user: User
}

export interface RegisterResponse {
  id: string
  email: string
  name: string
  role: string
}

export interface RegisterPayload {
  email: string
  name: string
  password: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface ChangePasswordPayload {
  current_password: string
  new_password: string
}

export interface GoogleAuthPayload {
  id_token: string
}

export interface MyPermissionsResponse {
  user_id: string
  permissions: string[]
}