import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useIdleLogout } from './useIdleLogout'

describe('useIdleLogout', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  test('calls onIdle once the timeout elapses with no activity', () => {
    const onIdle = vi.fn()
    renderHook(() => useIdleLogout(1000, onIdle))

    act(() => {
      vi.advanceTimersByTime(999)
    })
    expect(onIdle).not.toHaveBeenCalled()

    act(() => {
      vi.advanceTimersByTime(1)
    })
    expect(onIdle).toHaveBeenCalledTimes(1)
  })

  test('activity resets the timer', () => {
    const onIdle = vi.fn()
    renderHook(() => useIdleLogout(1000, onIdle))

    act(() => {
      vi.advanceTimersByTime(900)
      window.dispatchEvent(new Event('keydown'))
    })
    act(() => {
      vi.advanceTimersByTime(900)
    })
    expect(onIdle).not.toHaveBeenCalled()

    act(() => {
      vi.advanceTimersByTime(100)
    })
    expect(onIdle).toHaveBeenCalledTimes(1)
  })

  test('does nothing while disabled', () => {
    const onIdle = vi.fn()
    renderHook(() => useIdleLogout(1000, onIdle, false))

    act(() => {
      vi.advanceTimersByTime(5000)
    })
    expect(onIdle).not.toHaveBeenCalled()
  })
})
