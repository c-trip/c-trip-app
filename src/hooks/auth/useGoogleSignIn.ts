import { useCallback, useEffect, useRef, useState } from 'react'
import { useAuth } from './useAuth'

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined
const SCRIPT_SRC = 'https://accounts.google.com/gsi/client'

interface GoogleCredentialResponse {
  credential?: string
}

interface GoogleIdApi {
  initialize: (config: {
    client_id: string
    callback: (res: GoogleCredentialResponse) => void
  }) => void
  prompt: (listener?: (notification: unknown) => void) => void
}

function getGoogleId(): GoogleIdApi | undefined {
  return (window as unknown as { google?: { accounts?: { id?: GoogleIdApi } } }).google?.accounts?.id
}

function loadScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (getGoogleId()) return resolve()
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_SRC}"]`)
    if (existing) {
      existing.addEventListener('load', () => resolve())
      existing.addEventListener('error', () => reject(new Error('Falha ao carregar o Google')))
      return
    }
    const script = document.createElement('script')
    script.src = SCRIPT_SRC
    script.async = true
    script.defer = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Falha ao carregar o Google'))
    document.head.appendChild(script)
  })
}

/**
 * Login com Google (POST /auth/google). Fica indisponível se `VITE_GOOGLE_CLIENT_ID`
 * não estiver configurado.
 */
export function useGoogleSignIn(onSuccess?: () => void) {
  const { loginWithGoogle } = useAuth()
  const isAvailable = Boolean(CLIENT_ID)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const initialized = useRef(false)
  const onSuccessRef = useRef(onSuccess)
  useEffect(() => {
    onSuccessRef.current = onSuccess
  })

  const handleCredential = useCallback(
    async (res: GoogleCredentialResponse) => {
      if (!res.credential) {
        setError('Não foi possível autenticar com o Google.')
        return
      }
      setLoading(true)
      setError(null)
      try {
        await loginWithGoogle(res.credential)
        onSuccessRef.current?.()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao entrar com o Google.')
      } finally {
        setLoading(false)
      }
    },
    [loginWithGoogle],
  )

  const signIn = useCallback(async () => {
    if (!CLIENT_ID) return
    setError(null)
    try {
      await loadScript()
      const googleId = getGoogleId()
      if (!googleId) throw new Error('Google indisponível')
      if (!initialized.current) {
        googleId.initialize({ client_id: CLIENT_ID, callback: (res) => void handleCredential(res) })
        initialized.current = true
      }
      googleId.prompt()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao abrir o Google.')
    }
  }, [handleCredential])

  return { isAvailable, signIn, loading, error }
}
