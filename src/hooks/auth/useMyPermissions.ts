import { authApi } from '@/services/authService'
import { useAsyncData } from '@/hooks/useAsync'

/** GET /auth/my-permissions — permissões (RBAC) do utilizador autenticado. */
export function useMyPermissions(enabled = true) {
  return useAsyncData(() => authApi.myPermissions(), 'my-permissions', {
    enabled,
    fallbackError: 'Não foi possível carregar as permissões.',
  })
}
