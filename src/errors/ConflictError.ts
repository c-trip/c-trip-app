import { ApiError } from './ApiError'

export class ConflictError extends ApiError {
  constructor(message: string, code?: string) {
    super(409, message, code)
    this.name = 'ConflictError'
  }
}