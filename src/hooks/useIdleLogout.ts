import { useEffect, useRef } from 'react'

// Kept in step with the API's SESSION_IDLE_MINUTES.
export const SESSION_IDLE_MS = 30 * 60 * 1000

const ACTIVITY_EVENTS = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'wheel'] as const

/**
 * Calls `onIdle` once the user has been inactive for `timeoutMs`.
 * A hidden/closed tab counts as inactive (no events fire), so the clock keeps running.
 */
export function useIdleLogout(timeoutMs: number, onIdle: () => void, enabled = true) {
  const onIdleRef = useRef(onIdle)

  useEffect(() => {
    onIdleRef.current = onIdle
  })

  useEffect(() => {
    if (!enabled) return

    let timer: ReturnType<typeof setTimeout> | undefined
    const reset = () => {
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => onIdleRef.current(), timeoutMs)
    }

    ACTIVITY_EVENTS.forEach((event) => window.addEventListener(event, reset, { passive: true }))
    reset()

    return () => {
      if (timer) clearTimeout(timer)
      ACTIVITY_EVENTS.forEach((event) => window.removeEventListener(event, reset))
    }
  }, [timeoutMs, enabled])
}

export default useIdleLogout
