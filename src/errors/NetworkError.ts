export class NetworkError extends Error {
  constructor(message = 'Não foi possível ligar ao servidor. Verifique a sua ligação à internet.') {
    super(message)
    this.name = 'NetworkError'
  }
}
