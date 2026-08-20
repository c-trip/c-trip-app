import type { PropsWithChildren } from 'react'
import { BrowserRouter } from 'react-router'

export function AppProviders({ children }: PropsWithChildren) {
  return <BrowserRouter basename={import.meta.env.BASE_URL}>{children}</BrowserRouter>
}
