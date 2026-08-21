import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GooeyToaster } from 'goey-toast'
import 'goey-toast/styles.css'
import { AppProviders } from './app/providers'
import Router from './app/router'
import './styles/index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProviders>
      <Router />
      <GooeyToaster position="bottom-center" theme="light" />
    </AppProviders>
  </StrictMode>,
)
