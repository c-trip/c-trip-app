import { useOperatorStore } from '@/stores/operatorStore'

export function useOperator() {
  const { operator, isAuthenticated, loadSession, setSession, clearSession } = useOperatorStore()

  return { operator, isAuthenticated, loadSession, setSession, clearSession }
}