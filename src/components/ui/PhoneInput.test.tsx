import { describe, expect, test, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import PhoneInput from './PhoneInput'

describe('PhoneInput', () => {
  test('shows the country code prefix', () => {
    render(<PhoneInput value="" onChange={() => {}} />)
    expect(screen.getByText('+234')).toBeTruthy()
  })

  test('renders the national number without the country code', () => {
    render(<PhoneInput value="+2348012345678" onChange={() => {}} />)
    expect(screen.getByDisplayValue('801 234 5678')).toBeTruthy()
  })

  test('normalises typed input to E.164 via onChange', () => {
    const onChange = vi.fn()
    render(<PhoneInput value="" onChange={onChange} />)

    fireEvent.change(screen.getByPlaceholderText('801 234 5678'), {
      target: { value: '08012345678' },
    })

    expect(onChange).toHaveBeenCalledWith('+2348012345678')
  })
})
