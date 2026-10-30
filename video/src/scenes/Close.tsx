import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion'
import { AppFrame } from '../components/AppFrame'
import { COLORS, FONT } from '../theme'

export function Close() {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const closed = frame > 1.6 * fps
  const progress = interpolate(frame, [0.3 * fps, 1.4 * fps], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const present = Math.round(11 * progress)
  const absent = Math.round(1 * progress)
  const rate = Math.round(92 * progress)

  const stats = [
    { label: 'Present', value: `${present}`, color: '#065F46' },
    { label: 'Absent', value: `${absent}`, color: '#9F1239' },
    { label: 'Engagement', value: `${rate}%`, color: COLORS.brand },
  ]

  return (
    <AppFrame>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontFamily: FONT.serif, fontSize: 42, fontWeight: 600, color: COLORS.brand }}>
            Sunday Service
          </div>
          <div style={{ marginTop: 8, fontSize: 20, color: COLORS.muted }}>
            Sun, 18 Oct 2026 · 8:00 AM
          </div>
        </div>
        <div
          style={{
            borderRadius: 999,
            padding: '10px 22px',
            fontSize: 18,
            fontWeight: 600,
            backgroundColor: closed ? COLORS.sidebar : '#DCFCE7',
            color: closed ? COLORS.brand : '#166534',
          }}
        >
          {closed ? 'Closed' : 'Ongoing'}
        </div>
      </div>

      <div
        style={{
          marginTop: 44,
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 28,
        }}
      >
        {stats.map((stat) => (
          <div
            key={stat.label}
            style={{
              border: `1px solid ${COLORS.line}`,
              borderRadius: 24,
              backgroundColor: COLORS.white,
              padding: '32px 36px',
              boxShadow: '0 18px 55px rgba(15,23,42,0.06)',
            }}
          >
            <div style={{ fontSize: 14, letterSpacing: 3, textTransform: 'uppercase', color: COLORS.muted }}>
              {stat.label}
            </div>
            <div
              style={{
                marginTop: 16,
                fontFamily: FONT.serif,
                fontSize: 62,
                fontWeight: 600,
                color: stat.color,
              }}
            >
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 36, fontSize: 22, color: COLORS.muted, lineHeight: 1.6 }}>
        The record is saved. Every unmarked steward was recorded absent automatically when the
        meeting closed.
      </div>
    </AppFrame>
  )
}
