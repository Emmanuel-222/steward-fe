import type { CSSProperties } from 'react'
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion'
import { AppFrame } from '../components/AppFrame'
import { Cursor } from '../components/Cursor'
import { COLORS, FONT } from '../theme'

const ROSTER = [
  'Kehinde Balogun',
  'Chiamaka Okafor',
  'Tobi Adeleke',
  'Emeka Obi',
  'Grace Adeyemi',
  'Samuel Nwosu',
  'Blessing Eze',
  'Daniel Akintola',
  'Esther Bello',
  'Michael Uche',
  'Ruth Adebayo',
  'Peter Ilesanmi',
]

const INDIVIDUAL = 9
const BULK = [9, 10]

const rowStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '56px 2fr 1fr',
  alignItems: 'center',
  padding: '14px 18px',
  borderTop: `1px solid ${COLORS.line}`,
  fontSize: 21,
  color: COLORS.ink,
}

function badge(present: boolean, absent: boolean): CSSProperties {
  const background = absent ? '#FEE2E2' : present ? '#D1FAE5' : COLORS.sidebar
  const color = absent ? '#9F1239' : present ? '#065F46' : COLORS.muted
  return {
    justifySelf: 'start',
    borderRadius: 999,
    padding: '6px 16px',
    fontSize: 17,
    fontWeight: 600,
    backgroundColor: background,
    color,
  }
}

export function Mark() {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const individual = Math.min(
    INDIVIDUAL,
    Math.max(0, Math.floor((frame - 0.8 * fps) / (0.22 * fps))),
  )
  const bulkChecked = frame > 6.5 * fps
  const bulkApplied = frame > 8 * fps
  const absentMarked = frame > 10 * fps
  const rush = frame > 9 * fps

  const isPresent = (index: number) =>
    index < individual || (BULK.includes(index) && bulkApplied)
  const isAbsent = (index: number) => index === 11 && absentMarked

  const present = ROSTER.filter((_, index) => isPresent(index)).length
  const absent = ROSTER.filter((_, index) => isAbsent(index)).length
  const unmarked = ROSTER.length - present - absent

  const summary = [
    { label: 'Present', value: present, color: '#065F46' },
    { label: 'Absent', value: absent, color: '#9F1239' },
    { label: 'Unmarked', value: unmarked, color: COLORS.muted },
  ]

  const cursorX = interpolate(frame, [0, 1 * fps, 8.4 * fps, 11 * fps], [1200, 620, 900, 380], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const cursorY = interpolate(frame, [0, 1 * fps, 8.4 * fps, 11 * fps], [150, 300, 620, 760], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const press = (frame > 8.2 * fps && frame < 8.4 * fps) || (frame > 11.1 * fps && frame < 11.3 * fps)

  return (
    <>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                borderRadius: 999,
                padding: '10px 20px',
                fontSize: 18,
                fontWeight: 600,
                backgroundColor: rush ? '#FEF3C7' : COLORS.sidebar,
                color: rush ? '#92400E' : COLORS.muted,
              }}
            >
              Rush mode
            </div>
            <div
              style={{
                borderRadius: 999,
                padding: '10px 22px',
                fontSize: 18,
                fontWeight: 600,
                backgroundColor: '#DCFCE7',
                color: '#166534',
              }}
            >
              Ongoing
            </div>
          </div>
        </div>

        <div style={{ marginTop: 28, display: 'flex', gap: 40 }}>
          {summary.map((item) => (
            <div key={item.label}>
              <div style={{ fontSize: 13, letterSpacing: 2, textTransform: 'uppercase', color: COLORS.muted }}>
                {item.label}
              </div>
              <div style={{ marginTop: 6, fontFamily: FONT.serif, fontSize: 40, fontWeight: 600, color: item.color }}>
                {item.value}
              </div>
            </div>
          ))}

          <div
            style={{
              marginLeft: 'auto',
              alignSelf: 'center',
              borderRadius: 12,
              padding: '14px 24px',
              fontSize: 19,
              fontWeight: 600,
              color: COLORS.white,
              backgroundColor: bulkChecked ? COLORS.brand : COLORS.muted,
            }}
          >
            Mark present
          </div>
        </div>

        <div style={{ marginTop: 30 }}>
          {ROSTER.map((name, index) => {
            const checked = BULK.includes(index) && bulkChecked && !bulkApplied
            const flash = BULK.includes(index) && bulkApplied && frame < 8.6 * fps
            return (
              <div
                key={name}
                style={{
                  ...rowStyle,
                  backgroundColor: flash ? 'rgba(16,185,129,0.12)' : 'transparent',
                }}
              >
                <div
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: 7,
                    border: `2px solid ${checked ? COLORS.brand : COLORS.line}`,
                    backgroundColor: checked ? COLORS.brand : COLORS.white,
                    color: COLORS.white,
                    fontSize: 16,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {checked ? '✓' : ''}
                </div>
                <div style={{ fontWeight: 600 }}>{name}</div>
                <div style={badge(isPresent(index), isAbsent(index))}>
                  {isAbsent(index) ? 'Absent' : isPresent(index) ? 'Present' : 'Unmarked'}
                </div>
              </div>
            )
          })}
        </div>
      </AppFrame>

      <Cursor x={cursorX} y={cursorY} press={press} />
    </>
  )
}
