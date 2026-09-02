import axios, { AxiosError, type AxiosInstance } from 'axios'
import { BASE_URL } from '@/constants/base_url'
import { getToken } from './tokenStore'
import { ApiError } from '@/errors/ApiError'
import { AuthError } from '@/errors/AuthError'
import { NetworkError } from '@/errors/NetworkError'

export const http: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

http.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`)
  }
  return config
})

function extractMessage(status: number, data: unknown): string {
  if (data && typeof data === 'object') {
    const record = data as Record<string, unknown>
    const detail = record.detail
    if (typeof detail === 'string' && detail) return detail
    if (typeof record.message === 'string' && record.message) return record.message
    if (Array.isArray(detail)) {
      const first = detail[0]
      if (first && typeof first === 'object') {
        const msg = (first as Record<string, unknown>).msg
        if (typeof msg === 'string' && msg) return msg
      }
    }
  }
  return `Ocorreu um erro inesperado (${status}).`
}

http.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (!error.response) {
      return Promise.reject(new NetworkError())
    }

    const { status, data } = error.response
    const message = extractMessage(status, data)

    if (status === 401 || status === 403) {
      return Promise.reject(new AuthError(status, message))
    }

    return Promise.reject(new ApiError(status, message, undefined, data))
  },
)
