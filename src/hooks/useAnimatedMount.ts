import { useEffect, useState } from 'react'

type Phase = 'enter' | 'exit' | null

export function useAnimatedMount(isOpen: boolean, exitDuration = 200) {
  const [mounted, setMounted] = useState(false)
  const [phase, setPhase] = useState<Phase>(null)

  useEffect(() => {
    if (isOpen) {
      setMounted(true)
      setPhase('enter')
    } else if (mounted) {
      setPhase('exit')
      const timer = setTimeout(() => {
        setMounted(false)
        setPhase(null)
      }, exitDuration)
      return () => clearTimeout(timer)
    }
  }, [isOpen, exitDuration, mounted])

  return { mounted, phase }
}
