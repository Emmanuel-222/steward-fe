import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import AppProviders from './app/providers/AppProviders.tsx'
import { refreshAccessToken } from './services/axios'
import { getAccessToken, isLoggedOut } from './services/tokenStore'

async function ensureSession() {
  if (isLoggedOut()) return
  if (!getAccessToken()) {
    await refreshAccessToken()
  }
}

ensureSession()
  .catch(() => {
    /* transient refresh failure — render signed-out and let the app retry */
  })
  .finally(() => {
    createRoot(document.getElementById('root')!).render(
      <StrictMode>
        <AppProviders>
          <App />
        </AppProviders>
      </StrictMode>,
    )
  })
