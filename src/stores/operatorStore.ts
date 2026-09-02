import { create } from 'zustand'

const OPERATOR_SESSION_KEY = 'operatorSession'

export interface OperatorSession {
  operatorCode: string
  name: string
  company: string
}

interface OperatorState {
  operator: OperatorSession | null
  isAuthenticated: boolean
  loadSession: () => void
  setSession: (session: OperatorSession) => void
  clearSession: () => void
}

function readSession(): OperatorSession | null {
  try {
    const raw = sessionStorage.getItem(OPERATOR_SESSION_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<OperatorSession>
    if (typeof parsed.operatorCode !== 'string' || parsed.operatorCode.length === 0) return null
    return {
      operatorCode: parsed.operatorCode,
      name: typeof parsed.name === 'string' ? parsed.name : '',
      company: typeof parsed.company === 'string' ? parsed.company : '',
    }
  } catch {
    return null
  }
}

export const useOperatorStore = create<OperatorState>((set) => ({
  operator: null,
  isAuthenticated: false,

  loadSession: () => {
    const session = readSession()
    set({ operator: session, isAuthenticated: session !== null })
  },

  setSession: (session) => {
    try {
      sessionStorage.setItem(OPERATOR_SESSION_KEY, JSON.stringify(session))
    } catch {
      /* ignore */
    }
    set({ operator: session, isAuthenticated: true })
  },

  clearSession: () => {
    try {
      sessionStorage.removeItem(OPERATOR_SESSION_KEY)
    } catch {
      /* ignore */
    }
    set({ operator: null, isAuthenticated: false })
  },
}))