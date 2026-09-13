import { useEffect, useRef, useState } from 'react'

type Phase = 'enter' | 'exit' | null

export function useAnimatedMount(isOpen: boolean, exitDuration = 200) {
  const [mounted, setMounted] = useState(false)
  const [phase, setPhase] = useState<Phase>(null)
  const prevIsOpen = useRef(isOpen)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (prevIsOpen.current === isOpen) return
    prevIsOpen.current = isOpen

    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }

    /* eslint-disable react-hooks/set-state-in-effect -- animation state machine: setState is the intended mechanism */
    if (isOpen) {
      setMounted(true)
      setPhase('enter')
    } else if (mounted) {
      setPhase('exit')
      timerRef.current = setTimeout(() => {
        setMounted(false)
        setPhase(null)
        timerRef.current = null
      }, exitDuration)
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [isOpen, exitDuration, mounted])

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
    }
  }, [])

  return { mounted, phase }
}
