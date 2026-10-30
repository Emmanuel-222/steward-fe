import type { ReactNode } from 'react'
import { FONT } from '../theme'

/**
 * Sized so it stays readable when the 1920px frame is scaled down to a phone:
 * 64px here is ~12px at 375px wide. (The plan's 30px would have been ~6px.)
 */
export function Caption({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 56,
        display: 'flex',
        justifyContent: 'center',
        zIndex: 60,
      }}
    >
      <div
        style={{
          maxWidth: 1400,
          backgroundColor: 'rgba(15,45,82,0.86)',
          color: '#FFFFFF',
          fontFamily: FONT.sans,
          fontSize: 64,
          fontWeight: 600,
          lineHeight: 1.25,
          padding: '18px 40px',
          borderRadius: 20,
          textAlign: 'center',
        }}
      >
        {children}
      </div>
    </div>
  )
}
