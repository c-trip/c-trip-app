import { ApiError } from './ApiError'

export class NotFoundError extends ApiError {
  constructor(message: string, code?: string) {
    super(404, message, code)
    this.name = 'NotFoundError'
  }
}