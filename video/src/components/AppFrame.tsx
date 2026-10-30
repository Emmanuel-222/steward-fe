import type { ReactNode } from 'react'
import { AbsoluteFill } from 'remotion'
import { COLORS, FONT } from '../theme'

type AppFrameProps = {
  children: ReactNode
  title?: string
}

/**
 * The app's chrome, so every scene reads as the same product: the soft blue
 * sidebar, the white header with the page title, and the page background.
 */
export function AppFrame({ children, title = 'Steward Registry' }: AppFrameProps) {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.page, fontFamily: FONT.sans }}>
      <div style={{ display: 'flex', height: '100%' }}>
        <div
          style={{
            width: 300,
            backgroundColor: COLORS.sidebar,
            borderRight: `1px solid ${COLORS.line}`,
            padding: '36px 32px',
          }}
        >
          <div style={{ fontFamily: FONT.serif, fontSize: 30, fontWeight: 600, color: COLORS.brand }}>
            The Registrar
          </div>
          <div
            style={{
              marginTop: 10,
              fontSize: 11,
              letterSpacing: 4,
              textTransform: 'uppercase',
              color: COLORS.muted,
            }}
          >
            Attendance Management
          </div>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              height: 92,
              display: 'flex',
              alignItems: 'center',
              padding: '0 40px',
              backgroundColor: COLORS.white,
              borderBottom: `1px solid ${COLORS.line}`,
            }}
          >
            <div style={{ fontFamily: FONT.serif, fontSize: 28, fontWeight: 600, color: COLORS.brand }}>
              {title}
            </div>
          </div>
          <div style={{ flex: 1, padding: 40, position: 'relative' }}>{children}</div>
        </div>
      </div>
    </AbsoluteFill>
  )
}
