let accessToken: string | null = null

const LOGGED_OUT_KEY = 'steward:loggedOut'

export function getAccessToken(): string | null {
  return accessToken
}

export function setAccessToken(token: string | null): void {
  accessToken = token
}

export function clearAccessToken(): void {
  accessToken = null
}

// A client-side "logged out" marker so an explicit logout can't be undone by a
// surviving httpOnly cookie (e.g. when the logout request fails offline).
export function markLoggedOut(): void {
  try {
    localStorage.setItem(LOGGED_OUT_KEY, '1')
  } catch {
    /* storage unavailable */
  }
}

export function clearLoggedOut(): void {
  try {
    localStorage.removeItem(LOGGED_OUT_KEY)
  } catch {
    /* storage unavailable */
  }
}

export function isLoggedOut(): boolean {
  try {
    return localStorage.getItem(LOGGED_OUT_KEY) === '1'
  } catch {
    return false
  }
}
