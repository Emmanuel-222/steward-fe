import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import AppProviders from './app/providers/AppProviders.tsx'
import { refreshAccessToken } from './services/axios'
import { getAccessToken } from './services/tokenStore'

async function ensureSession() {
  if (!getAccessToken()) {
    await refreshAccessToken()
  }
}

ensureSession().finally(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <AppProviders>
        <App />
      </AppProviders>
    </StrictMode>,
  )
})
