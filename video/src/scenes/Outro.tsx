import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion'
import { COLORS, FONT } from '../theme'

export function Outro() {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const titleOpacity = interpolate(frame, [0, 0.6 * fps], [0, 1], { extrapolateRight: 'clamp' })
  const ruleWidth = interpolate(frame, [0.4 * fps, 1.2 * fps], [0, 44], { extrapolateRight: 'clamp' })
  const ctaOpacity = interpolate(frame, [0.9 * fps, 1.6 * fps], [0, 1], { extrapolateRight: 'clamp' })

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.brand,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          fontFamily: FONT.serif,
          fontSize: 76,
          fontWeight: 600,
          color: COLORS.white,
          opacity: titleOpacity,
        }}
      >
        Ready when your church is.
      </div>

      <div style={{ width: ruleWidth, height: 2, backgroundColor: COLORS.signature, marginTop: 28 }} />

      <div
        style={{
          marginTop: 40,
          borderRadius: 14,
          padding: '22px 48px',
          fontSize: 30,
          fontWeight: 700,
          fontFamily: FONT.sans,
          backgroundColor: COLORS.signature,
          color: '#2B2416',
          opacity: ctaOpacity,
        }}
      >
        Get started
      </div>
    </AbsoluteFill>
  )
}
