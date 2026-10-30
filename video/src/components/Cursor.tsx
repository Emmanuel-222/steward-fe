import { COLORS } from '../theme'

type CursorProps = {
  x: number
  y: number
  press?: boolean
}

export function Cursor({ x, y, press = false }: CursorProps) {
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `scale(${press ? 0.85 : 1})`,
        transformOrigin: 'top left',
        zIndex: 50,
      }}
    >
      <svg width="30" height="30" viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M4 2 L4 20 L9 15 L12.5 22 L15.5 20.5 L12 13.8 L19 13.5 Z"
          fill={COLORS.brand}
          stroke={COLORS.white}
          strokeWidth="1.2"
        />
      </svg>
    </div>
  )
}
