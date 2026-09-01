import { ApiError } from './ApiError'

export class AuthError extends ApiError {
  constructor(status: number, message: string) {
    super(status, message)
    this.name = 'AuthError'
  }
}
