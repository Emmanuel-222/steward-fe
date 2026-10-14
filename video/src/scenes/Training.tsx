import type { CSSProperties } from 'react'
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion'
import { AppFrame } from '../components/AppFrame'
import { COLORS, FONT } from '../theme'

const SESSIONS = [
  { week: 1, topic: 'Brief History of RCCG / Vision & Mission Statement', teacher: 'Tobi Adeleke' },
  { week: 2, topic: 'The Discovery Centre Steward: Expectations & Requirements', teacher: 'Chiamaka Okafor' },
  { week: 3, topic: 'The Bible', teacher: 'Samuel Nwosu' },
  { week: 4, topic: 'Who Are You? About Man', teacher: 'Grace Adeyemi' },
]

const headStyle: CSSProperties = {
  fontSize: 13,
  letterSpacing: 2,
  textTransform: 'uppercase',
  color: COLORS.muted,
  paddingBottom: 14,
}

export function Training() {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const revealed = Math.min(
    SESSIONS.length,
    Math.max(0, Math.floor((frame - 0.6 * fps) / (0.5 * fps))),
  )

  return (
    <AppFrame>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontFamily: FONT.serif, fontSize: 42, fontWeight: 600, color: COLORS.brand }}>
            2026 Intake
          </div>
          <div style={{ marginTop: 10, fontSize: 20, color: COLORS.muted }}>
            12 weeks · allowed misses 3 · 128 trainees
          </div>
        </div>
        <div
          style={{
            borderRadius: 999,
            padding: '10px 22px',
            fontSize: 18,
            fontWeight: 600,
            backgroundColor: COLORS.sidebar,
            color: COLORS.brand,
          }}
        >
          Workers-in-Training
        </div>
      </div>

      <div style={{ marginTop: 34, fontSize: 24, fontWeight: 600, color: COLORS.brand }}>
        Schedule
      </div>

      <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: '1fr 3fr 1.4fr' }}>
        <div style={headStyle}>Week</div>
        <div style={headStyle}>Session</div>
        <div style={headStyle}>Teacher</div>
      </div>

      {SESSIONS.slice(0, revealed).map((session) => (
        <div
          key={session.topic}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 3fr 1.4fr',
            alignItems: 'center',
            padding: '18px 0',
            borderTop: `1px solid ${COLORS.line}`,
            fontSize: 21,
            color: COLORS.ink,
          }}
        >
          <div style={{ color: COLORS.muted }}>Week {session.week}</div>
          <div style={{ fontWeight: 600 }}>{session.topic}</div>
          <div
            style={{
              justifySelf: 'start',
              borderRadius: 999,
              padding: '7px 18px',
              fontSize: 17,
              fontWeight: 600,
              backgroundColor: COLORS.sidebar,
              color: COLORS.brand,
            }}
          >
            {session.teacher}
          </div>
        </div>
      ))}
      <div style={{ marginTop: 30, display: 'flex', gap: 36 }}>
        <div style={{ flex: 1 }}>
          <div style={headStyle}>Trainees</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {['Grace Adeyemi', 'Emeka Obi', 'Blessing Eze', 'Daniel Akintola', 'Esther Bello'].map(
              (name) => (
                <span
                  key={name}
                  style={{
                    borderRadius: 999,
                    padding: '8px 16px',
                    fontSize: 17,
                    backgroundColor: COLORS.sidebar,
                    color: COLORS.brand,
                  }}
                >
                  {name}
                </span>
              ),
            )}
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <div style={headStyle}>Teaching · Week 1</div>
          {['Grace Adeyemi', 'Emeka Obi', 'Blessing Eze'].map((name, index) => (
            <div
              key={name}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '11px 0',
                borderTop: `1px solid ${COLORS.line}`,
                fontSize: 19,
                color: COLORS.ink,
              }}
            >
              <span>{name}</span>
              <span style={{ fontWeight: 600, color: index === 1 ? '#9F1239' : '#065F46' }}>
                {index === 1 ? 'Absent' : 'Present'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </AppFrame>
  )
}
