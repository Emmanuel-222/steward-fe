import { AbsoluteFill } from 'remotion'

export function Hello() {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0F2D52',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          fontFamily: "'Spectral', Georgia, serif",
          color: '#FFFFFF',
          fontSize: 96,
          fontWeight: 600,
        }}
      >
        The Registrar
      </div>
      <div style={{ width: 44, height: 2, backgroundColor: '#C8A45C', marginTop: 28 }} />
    </AbsoluteFill>
  )
}
