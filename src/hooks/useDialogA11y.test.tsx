import { describe, expect, test, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import useDialogA11y from './useDialogA11y'

function Dialog({ onClose }: { onClose: () => void }) {
  const ref = useDialogA11y<HTMLDivElement>(onClose)

  return (
    <div ref={ref} tabIndex={-1} role="dialog" aria-modal="true">
      <button type="button">First</button>
      <button type="button">Last</button>
    </div>
  )
}

describe('useDialogA11y', () => {
  test('moves focus to the first focusable element on mount', () => {
    render(<Dialog onClose={() => {}} />)

    expect(document.activeElement).toBe(screen.getByText('First'))
  })

  test('calls onClose when Escape is pressed', () => {
    const onClose = vi.fn()
    render(<Dialog onClose={onClose} />)

    fireEvent.keyDown(document, { key: 'Escape' })

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  test('wraps Tab from the last element back to the first', () => {
    render(<Dialog onClose={() => {}} />)

    screen.getByText('Last').focus()
    fireEvent.keyDown(document, { key: 'Tab' })

    expect(document.activeElement).toBe(screen.getByText('First'))
  })

  test('wraps Shift+Tab from the first element to the last', () => {
    render(<Dialog onClose={() => {}} />)

    screen.getByText('First').focus()
    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true })

    expect(document.activeElement).toBe(screen.getByText('Last'))
  })

  test('restores focus to the previously focused element on unmount', () => {
    const trigger = document.createElement('button')
    trigger.textContent = 'Open'
    document.body.appendChild(trigger)
    trigger.focus()

    const { unmount } = render(<Dialog onClose={() => {}} />)
    expect(document.activeElement).toBe(screen.getByText('First'))

    unmount()

    expect(document.activeElement).toBe(trigger)
    trigger.remove()
  })
})
