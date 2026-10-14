import type { CSSProperties } from 'react'
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion'
import { AppFrame } from '../components/AppFrame'
import { Cursor } from '../components/Cursor'
import { COLORS, FONT } from '../theme'

type Status = 'Pending' | 'Approved'

const REQUESTS: { name: string; meeting: string; reason: string; status: Status }[] = [
  { name: 'Emeka Obi', meeting: 'Sunday Service · 11 Oct', reason: 'Travelling', status: 'Pending' },
  { name: 'Grace Adeyemi', meeting: 'Sunday Service · 4 Oct', reason: 'Illness', status: 'Approved' },
  { name: 'Michael Uche', meeting: 'Prayer Meeting · 8 Oct', reason: 'Work', status: 'Approved' },
]

function statusStyle(status: Status): CSSProperties {
  return {
    justifySelf: 'start',
    borderRadius: 999,
    padding: '7px 18px',
    fontSize: 17,
    fontWeight: 600,
    backgroundColor: status === 'Pending' ? '#FEF3C7' : '#D1FAE5',
    color: status === 'Pending' ? '#92400E' : '#065F46',
  }
}

export function Excuses() {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const approved = frame > 3 * fps
  const approvePressed = frame > 2.9 * fps

  const cursorX = interpolate(frame, [0, 0.8 * fps, 2.8 * fps], [1200, 1790, 1790], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const cursorY = interpolate(frame, [0, 0.8 * fps, 2.8 * fps], [150, 320, 320], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const press = frame > 2.9 * fps && frame < 3.1 * fps

  return (
    <>
      <AppFrame>
        <div style={{ fontFamily: FONT.serif, fontSize: 42, fontWeight: 600, color: COLORS.brand }}>
          Excuse requests
        </div>
        <div style={{ marginTop: 10, fontSize: 20, color: COLORS.muted }}>
          Reviewed by each department leader.
        </div>

        <div style={{ marginTop: 34 }}>
          {REQUESTS.map((request, index) => {
            const status: Status = index === 0 && approved ? 'Approved' : request.status
            return (
              <div
                key={request.name}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 2.4fr 1.4fr 1.4fr 1.2fr',
                  alignItems: 'center',
                  padding: '18px 20px',
                  borderTop: `1px solid ${COLORS.line}`,
                  fontSize: 21,
                  color: COLORS.ink,
                }}
              >
                <div style={{ fontWeight: 600 }}>{request.name}</div>
                <div style={{ color: COLORS.muted }}>{request.meeting}</div>
                <div style={{ color: COLORS.muted }}>{request.reason}</div>
                <div style={statusStyle(status)}>{status}</div>
                <div
                  style={{
                    justifySelf: 'end',
                    borderRadius: 10,
                    padding: '10px 20px',
                    fontSize: 18,
                    fontWeight: 600,
                    color: status === 'Pending' ? COLORS.white : COLORS.muted,
                    backgroundColor: status === 'Pending' ? COLORS.brand : COLORS.sidebar,
                  }}
                >
                  {status === 'Pending' ? 'Approve' : 'Reviewed'}
                </div>
              </div>
            )
          })}
        </div>

        {approvePressed ? (
          <div style={{ marginTop: 30, fontSize: 21, color: '#065F46', fontWeight: 600 }}>
            Emeka Obi's excuse approved — the absence is now recorded as excused.
          </div>
        ) : null}
      </AppFrame>

      <Cursor x={cursorX} y={cursorY} press={press} />
    </>
  )
}
