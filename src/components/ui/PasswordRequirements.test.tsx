import { describe, expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import PasswordRequirements from './PasswordRequirements'

describe('PasswordRequirements', () => {
  test('lists all four requirements', () => {
    render(<PasswordRequirements password="" />)

    expect(screen.getByText('At least 8 characters')).toBeTruthy()
    expect(screen.getByText('One uppercase letter')).toBeTruthy()
    expect(screen.getByText('One number')).toBeTruthy()
    expect(screen.getByText('One symbol')).toBeTruthy()
  })

  test('marks a met requirement with the success colour', () => {
    render(<PasswordRequirements password="Passw0rd!" />)

    const item = screen.getByText('At least 8 characters').closest('li')
    expect(item?.className).toContain('text-emerald-600')
  })

  test('leaves an unmet requirement in the muted colour', () => {
    render(<PasswordRequirements password="" />)

    const item = screen.getByText('One uppercase letter').closest('li')
    expect(item?.className).toContain('text-slate-400')
  })
})
