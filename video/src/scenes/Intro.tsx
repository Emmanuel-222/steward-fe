import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion'
import { COLORS, FONT } from '../theme'

export function Intro() {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const titleOpacity = interpolate(frame, [0, 0.6 * fps], [0, 1], { extrapolateRight: 'clamp' })
  const taglineOpacity = interpolate(frame, [0.6 * fps, 1.4 * fps], [0, 1], {
    extrapolateRight: 'clamp',
  })
  const taglineY = interpolate(frame, [0.6 * fps, 1.4 * fps], [24, 0], { extrapolateRight: 'clamp' })
  const ruleWidth = interpolate(frame, [1.2 * fps, 2 * fps], [0, 44], { extrapolateRight: 'clamp' })

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
          fontSize: 96,
          fontWeight: 600,
          letterSpacing: '-0.01em',
          color: COLORS.white,
          opacity: titleOpacity,
        }}
      >
        The Registrar
      </div>

      <div style={{ width: ruleWidth, height: 2, backgroundColor: COLORS.signature, marginTop: 30 }} />

      <div
        style={{
          fontFamily: FONT.serif,
          fontSize: 44,
          color: '#E8EEF7',
          marginTop: 30,
          opacity: taglineOpacity,
          transform: `translateY(${taglineY}px)`,
        }}
      >
        Every steward, accounted for.
      </div>
    </AbsoluteFill>
  )
}
