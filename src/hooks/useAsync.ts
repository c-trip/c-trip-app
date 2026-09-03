import { useCallback, useEffect, useRef, useState } from 'react'

function toMessage(err: unknown, fallback: string): string {
  return err instanceof Error && err.message ? err.message : fallback
}

interface AsyncDataState<T> {
  data: T | null
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

interface AsyncDataOptions {
  /** Quando `false`, o fetcher não corre (ex.: falta um id). */
  enabled?: boolean
  fallbackError?: string
}

/**
 * Carrega dados de uma função async e volta a carregar quando `key` muda.
 * `key` deve identificar de forma estável os argumentos do pedido (ex.: um id
 * ou `JSON.stringify(params)`). Respostas obsoletas são ignoradas.
 */
export function useAsyncData<T>(
  fetcher: () => Promise<T>,
  key: string,
  options: AsyncDataOptions = {},
): AsyncDataState<T> {
  const { enabled = true, fallbackError = 'Não foi possível carregar os dados.' } = options

  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(enabled)
  const [error, setError] = useState<string | null>(null)
  const [nonce, setNonce] = useState(0)

  const fetcherRef = useRef(fetcher)
  useEffect(() => {
    fetcherRef.current = fetcher
  })

  useEffect(() => {
    if (!enabled) return
    let active = true

    const run = async () => {
      try {
        const result = await fetcherRef.current()
        if (active) {
          setData(result)
          setError(null)
        }
      } catch (err) {
        if (active) setError(toMessage(err, fallbackError))
      } finally {
        if (active) setIsLoading(false)
      }
    }

    void run()
    return () => {
      active = false
    }
  }, [key, enabled, nonce, fallbackError])

  const refetch = useCallback(async () => {
    setIsLoading(true)
    setNonce((n) => n + 1)
  }, [])

  return { data, isLoading, error, refetch }
}

interface AsyncActionState<Args extends unknown[], Result> {
  run: (...args: Args) => Promise<Result | null>
  isLoading: boolean
  error: string | null
  reset: () => void
}

/**
 * Envolve uma mutação async: `run` devolve o resultado, ou `null` se falhar
 * (o erro fica em `error`).
 */
export function useAsyncAction<Args extends unknown[], Result>(
  action: (...args: Args) => Promise<Result>,
  fallbackError = 'Ocorreu um erro. Tente novamente.',
): AsyncActionState<Args, Result> {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const actionRef = useRef(action)
  useEffect(() => {
    actionRef.current = action
  })

  const run = useCallback(
    async (...args: Args): Promise<Result | null> => {
      setIsLoading(true)
      setError(null)
      try {
        return await actionRef.current(...args)
      } catch (err) {
        setError(toMessage(err, fallbackError))
        return null
      } finally {
        setIsLoading(false)
      }
    },
    [fallbackError],
  )

  const reset = useCallback(() => setError(null), [])

  return { run, isLoading, error, reset }
}
