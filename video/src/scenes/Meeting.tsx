import type { CSSProperties } from 'react'
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion'
import { AppFrame } from '../components/AppFrame'
import { Cursor } from '../components/Cursor'
import { COLORS, FONT } from '../theme'

const fieldLabel: CSSProperties = {
  fontSize: 14,
  letterSpacing: 2,
  textTransform: 'uppercase',
  color: COLORS.muted,
}

const fieldValue: CSSProperties = {
  marginTop: 8,
  height: 62,
  borderRadius: 12,
  border: `1px solid ${COLORS.line}`,
  backgroundColor: COLORS.white,
  padding: '0 20px',
  display: 'flex',
  alignItems: 'center',
  fontSize: 22,
  color: COLORS.ink,
}

const MEETING = {
  title: 'Sunday Service',
  date: 'Sun, 18 Oct 2026',
  time: '8:00 AM',
  type: 'Sunday',
}

export function Meeting() {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const formOpacity = interpolate(frame, [0.4 * fps, 1 * fps], [0, 1], { extrapolateRight: 'clamp' })
  const titleChars = Math.round(
    interpolate(frame, [1 * fps, 1.8 * fps], [0, MEETING.title.length], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }),
  )
  const filled = frame > 2.2 * fps
  const saved = frame > 4.6 * fps

  const cursorX = interpolate(frame, [0, 1 * fps, 2.4 * fps, 3.4 * fps, 4.6 * fps], [1180, 600, 600, 500, 430], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const cursorY = interpolate(frame, [0, 1 * fps, 2.4 * fps, 3.4 * fps, 4.6 * fps], [180, 340, 340, 480, 640], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const press = frame > 4.7 * fps && frame < 4.9 * fps

  return (
    <>
      <AppFrame>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div style={{ fontFamily: FONT.serif, fontSize: 44, fontWeight: 600, color: COLORS.brand }}>
            Meetings
          </div>
          <div
            style={{
              borderRadius: 12,
              padding: '16px 26px',
              fontSize: 20,
              fontWeight: 600,
              color: COLORS.white,
              backgroundColor: COLORS.brand,
            }}
          >
            Create meeting
          </div>
        </div>

        <div style={{ marginTop: 34, display: 'flex', gap: 32 }}>
          <div style={{ flex: 1.2, opacity: formOpacity }}>
            <div style={{ fontSize: 24, fontWeight: 600, color: COLORS.brand }}>New meeting</div>

            <div style={{ marginTop: 24 }}>
              <div style={fieldLabel}>Title</div>
              <div style={fieldValue}>{MEETING.title.slice(0, titleChars)}</div>
            </div>

            <div style={{ marginTop: 20, display: 'flex', gap: 20 }}>
              <div style={{ flex: 1 }}>
                <div style={fieldLabel}>Date</div>
                <div style={fieldValue}>{filled ? MEETING.date : ''}</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={fieldLabel}>Time</div>
                <div style={fieldValue}>{filled ? MEETING.time : ''}</div>
              </div>
            </div>

            <div style={{ marginTop: 20 }}>
              <div style={fieldLabel}>Type</div>
              <div style={fieldValue}>{filled ? MEETING.type : ''}</div>
            </div>

            <div
              style={{
                marginTop: 26,
                width: 200,
                height: 64,
                borderRadius: 12,
                backgroundColor: COLORS.brand,
                color: COLORS.white,
                fontSize: 20,
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              Save meeting
            </div>
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ ...fieldLabel, paddingBottom: 14 }}>Upcoming</div>
            {saved ? (
              <div
                style={{
                  border: `1px solid ${COLORS.line}`,
                  borderRadius: 16,
                  backgroundColor: COLORS.white,
                  padding: '20px 24px',
                }}
              >
                <div style={{ fontSize: 22, fontWeight: 600, color: COLORS.brand }}>{MEETING.title}</div>
                <div style={{ marginTop: 8, fontSize: 18, color: COLORS.muted }}>
                  {MEETING.date} · {MEETING.time}
                </div>
              </div>
            ) : (
              <div style={{ fontSize: 20, color: COLORS.muted }}>No upcoming meetings yet.</div>
            )}
          </div>
        </div>
      </AppFrame>

      <Cursor x={cursorX} y={cursorY} press={press} />
    </>
  )
}
