import type { CSSProperties } from 'react'
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion'
import { AppFrame } from '../components/AppFrame'
import { COLORS, FONT } from '../theme'

const ROSTER = [
  { name: 'Kehinde Balogun', department: 'TeamOne', role: 'Steward' },
  { name: 'Chiamaka Okafor', department: 'Children Dept.', role: 'Leader' },
  { name: 'Tobi Adeleke', department: 'Teens Dept.', role: 'Pastor' },
  { name: 'Emeka Obi', department: 'Sanitation Dept.', role: 'Steward' },
  { name: 'Grace Adeyemi', department: 'Light Team', role: 'Steward' },
  { name: 'Samuel Nwosu', department: 'Edification Team', role: 'Steward' },
  { name: 'Blessing Eze', department: 'Protocol Dept.', role: 'Steward' },
  { name: 'Daniel Akintola', department: 'Welfare Dept.', role: 'Steward' },
  { name: 'Esther Bello', department: 'Security Dept.', role: 'Steward' },
  { name: 'Michael Uche', department: 'Programs Dept.', role: 'Steward' },
  { name: 'Ruth Adebayo', department: 'Alpha Team', role: 'Steward' },
  { name: 'Peter Ilesanmi', department: 'Logistics and Technical Dept.', role: 'Steward' },
]

const headStyle: CSSProperties = {
  fontSize: 14,
  letterSpacing: 2,
  textTransform: 'uppercase',
  color: COLORS.muted,
  padding: '0 0 16px',
  textAlign: 'left',
}

const cellStyle: CSSProperties = {
  fontSize: 22,
  color: COLORS.ink,
  padding: '18px 0',
  borderTop: `1px solid ${COLORS.line}`,
}

export function People() {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // Three rows are added by hand, then the import fills the rest.
  const typedRows = 3
  const importProgress = interpolate(frame, [2 * fps, 4 * fps], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const importedRows = Math.round(importProgress * (ROSTER.length - typedRows))
  const visibleRows = Math.min(ROSTER.length, typedRows + importedRows)
  const showImport = frame > 1.8 * fps

  return (
    <AppFrame>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontFamily: FONT.serif, fontSize: 44, fontWeight: 600, color: COLORS.brand }}>
            Stewards
          </div>
          <div style={{ marginTop: 10, fontSize: 20, color: COLORS.muted }}>
            {visibleRows} of {ROSTER.length} members
          </div>
        </div>
        <div style={{ display: 'flex', gap: 14 }}>
          <div
            style={{
              border: `1px solid ${COLORS.line}`,
              borderRadius: 12,
              padding: '16px 24px',
              fontSize: 20,
              color: COLORS.brand,
              backgroundColor: COLORS.white,
            }}
          >
            Add steward
          </div>
          <div
            style={{
              borderRadius: 12,
              padding: '16px 24px',
              fontSize: 20,
              fontWeight: 600,
              color: COLORS.white,
              backgroundColor: showImport ? COLORS.brand : COLORS.muted,
            }}
          >
            Import roster
          </div>
        </div>
      </div>

      {showImport ? (
        <div style={{ marginTop: 24, height: 8, borderRadius: 999, backgroundColor: COLORS.line }}>
          <div
            style={{
              width: `${Math.round(importProgress * 100)}%`,
              height: 8,
              borderRadius: 999,
              backgroundColor: COLORS.signature,
            }}
          />
        </div>
      ) : null}

      <div style={{ marginTop: 32 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr' }}>
          <div style={headStyle}>Name</div>
          <div style={headStyle}>Department</div>
          <div style={headStyle}>Role</div>
        </div>

        {ROSTER.slice(0, visibleRows).map((member, index) => {
          const appear = interpolate(frame, [index * 2, index * 2 + 8], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          })
          return (
            <div
              key={member.name}
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 2fr 1fr',
                opacity: appear,
                transform: `translateY(${(1 - appear) * 8}px)`,
              }}
            >
              <div style={{ ...cellStyle, fontWeight: 600 }}>{member.name}</div>
              <div style={{ ...cellStyle, color: COLORS.muted }}>{member.department}</div>
              <div style={{ ...cellStyle, color: COLORS.muted }}>{member.role}</div>
            </div>
          )
        })}
      </div>
    </AppFrame>
  )
}
