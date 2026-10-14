import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion'
import { COLORS, FONT } from '../theme'
import { Cursor } from '../components/Cursor'

const EMAIL = 'grace@rccg-discovery.org'
const FIELD_LEFT = 1080
const EMAIL_TOP = 470
const PASSWORD_TOP = 580
const BUTTON_TOP = 730

function clamp(value: number) {
  return Math.max(0, Math.min(1, value))
}

export function SignIn() {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const typedChars = Math.round(
    interpolate(frame, [0.7 * fps, 2.6 * fps], [0, EMAIL.length], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }),
  )
  const email = EMAIL.slice(0, typedChars)
  const passwordChars = Math.round(
    interpolate(frame, [3 * fps, 4 * fps], [0, 10], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }),
  )
  const cardOpacity = interpolate(frame, [0, 0.4 * fps], [0, 1], { extrapolateRight: 'clamp' })

  // Cursor: settles on email, moves to password, then to the button and presses.
  const toEmail = clamp((frame - 0) / (0.7 * fps))
  const toPassword = clamp((frame - 3 * fps) / (0.4 * fps))
  const toButton = clamp((frame - 4.4 * fps) / (0.5 * fps))

  const x = 700 + toEmail * (FIELD_LEFT + 60 - 700) + toButton * 120
  const y =
    EMAIL_TOP +
    40 +
    toPassword * (PASSWORD_TOP - EMAIL_TOP) +
    toButton * (BUTTON_TOP - PASSWORD_TOP) +
    30
  const press = frame > 5 * fps && frame < 5.2 * fps

  const fieldStyle = {
    height: 74,
    borderRadius: 14,
    border: `1px solid ${COLORS.line}`,
    backgroundColor: COLORS.white,
    display: 'flex',
    alignItems: 'center',
    padding: '0 22px',
    fontSize: 24,
    color: COLORS.ink,
    fontFamily: FONT.sans,
  } as const

  return (
    <AbsoluteFill style={{ backgroundColor: '#F6F7FB', fontFamily: FONT.sans }}>
      <div
        style={{
          position: 'absolute',
          inset: 90,
          display: 'flex',
          borderRadius: 28,
          overflow: 'hidden',
          border: `1px solid ${COLORS.line}`,
          boxShadow: '0 28px 80px rgba(15,23,42,0.15)',
          opacity: cardOpacity,
          backgroundColor: COLORS.white,
        }}
      >
        {/* showcase panel */}
        <div style={{ flex: 1, backgroundColor: COLORS.brand, padding: 64, color: COLORS.white }}>
          <div style={{ fontFamily: FONT.serif, fontSize: 40, fontWeight: 600 }}>The Registrar</div>
          <div style={{ marginTop: 20, width: 44, height: 2, backgroundColor: COLORS.signature }} />
          <div style={{ marginTop: 28, fontFamily: FONT.serif, fontSize: 34, lineHeight: 1.3 }}>
            The Digital Registrar.
          </div>
          <div style={{ marginTop: 18, fontSize: 20, color: '#C7D2E4', lineHeight: 1.6 }}>
            Attendance records for every meeting — stewards, departments and excuse requests,
            all in one registry.
          </div>
        </div>

        {/* form panel */}
        <div style={{ flex: 1, padding: 64, position: 'relative' }}>
          <div style={{ fontFamily: FONT.serif, fontSize: 40, fontWeight: 600, color: COLORS.brand }}>
            Welcome Back
          </div>
          <div style={{ marginTop: 12, fontSize: 20, color: COLORS.muted }}>
            Please enter your registrar credentials to continue.
          </div>

          <div style={{ marginTop: 40, fontSize: 14, letterSpacing: 2, textTransform: 'uppercase', color: COLORS.muted }}>
            Email address
          </div>
          <div style={{ ...fieldStyle, marginTop: 10 }}>
            {email}
            {typedChars < EMAIL.length ? <span style={{ color: COLORS.brand }}>|</span> : null}
          </div>

          <div style={{ marginTop: 28, fontSize: 14, letterSpacing: 2, textTransform: 'uppercase', color: COLORS.muted }}>
            Password
          </div>
          <div style={{ ...fieldStyle, marginTop: 10, letterSpacing: 6 }}>
            {'•'.repeat(passwordChars)}
          </div>

          <div
            style={{
              marginTop: 40,
              height: 78,
              borderRadius: 14,
              backgroundColor: COLORS.brand,
              color: COLORS.white,
              fontSize: 24,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            Access Registry
          </div>
        </div>
      </div>

      <Cursor x={x} y={y} press={press} />
    </AbsoluteFill>
  )
}
