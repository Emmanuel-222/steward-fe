import type { CSSProperties } from 'react'
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion'
import { AppFrame } from '../components/AppFrame'
import { COLORS, FONT } from '../theme'

const STATS = [
  { label: 'Total Stewards', to: 128, suffix: '', detail: 'Live count' },
  { label: 'Total Meetings', to: 46, suffix: '', detail: 'Historical total' },
  { label: 'Active Session', to: 0, suffix: '', detail: 'No active meeting' },
  { label: 'Engagement Rate', to: 87, suffix: '%', detail: 'Average present' },
]

const cardStyle: CSSProperties = {
  border: `1px solid ${COLORS.line}`,
  borderRadius: 24,
  backgroundColor: COLORS.white,
  padding: '34px 38px',
  boxShadow: '0 18px 55px rgba(15,23,42,0.06)',
}

export function Overview() {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  return (
    <AppFrame>
      <div style={{ fontFamily: FONT.serif, fontSize: 48, fontWeight: 600, color: COLORS.brand }}>
        Overview
      </div>
      <div style={{ marginTop: 12, fontSize: 22, color: COLORS.muted }}>
        Monitoring registry activity for Sunday, Oct 18.
      </div>

      <div style={{ marginTop: 44, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }}>
        {STATS.map((stat, index) => {
          const start = (0.4 + index * 0.25) * fps
          const end = start + fps
          const progress = interpolate(frame, [start, end], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          })
          const value = Math.round(stat.to * progress)

          return (
            <div key={stat.label} style={cardStyle}>
              <div
                style={{
                  fontSize: 15,
                  letterSpacing: 3,
                  textTransform: 'uppercase',
                  color: COLORS.muted,
                }}
              >
                {stat.label}
              </div>
              <div
                style={{
                  marginTop: 18,
                  fontFamily: FONT.serif,
                  fontSize: 68,
                  fontWeight: 600,
                  color: COLORS.brand,
                }}
              >
                {stat.to === 0 && value === 0 ? '00' : `${value}${stat.suffix}`}
              </div>
              <div style={{ marginTop: 10, fontSize: 18, color: COLORS.muted }}>{stat.detail}</div>
            </div>
          )
        })}
      </div>
    </AppFrame>
  )
}
