import { expect, test } from 'vitest'
import { CAPTIONS } from './captions'
import { TOTAL_FRAMES } from './timeline'

test('every caption is inside the timeline and non-empty', () => {
  for (const caption of CAPTIONS) {
    expect(caption.text.trim().length).toBeGreaterThan(0)
    expect(caption.from).toBeGreaterThanOrEqual(0)
    expect(caption.from + caption.durationInFrames).toBeLessThanOrEqual(TOTAL_FRAMES)
  }
})

test('captions never overlap', () => {
  const sorted = [...CAPTIONS].sort((a, b) => a.from - b.from)
  for (let i = 1; i < sorted.length; i += 1) {
    expect(sorted[i].from).toBeGreaterThanOrEqual(
      sorted[i - 1].from + sorted[i - 1].durationInFrames,
    )
  }
})
