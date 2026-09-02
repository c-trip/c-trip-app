const STORAGE_KEY = 'c_trip_token'

let currentToken: string | null = readPersisted()

function readPersisted(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

export function getToken(): string | null {
  return currentToken
}

export function setToken(token: string | null): void {
  currentToken = token
  try {
    if (token) {
      localStorage.setItem(STORAGE_KEY, token)
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  } catch {
    /* localStorage indisponível (modo privado / SSR) — mantém só em memória */
  }
}
