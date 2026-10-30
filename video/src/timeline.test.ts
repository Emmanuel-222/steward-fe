import { expect, test } from 'vitest'
import { FPS, SCENES, TOTAL_FRAMES, sceneRange } from './timeline'

test('there are ten scenes and the timeline is 80 seconds', () => {
  expect(SCENES).toHaveLength(10)
  expect(FPS).toBe(30)
  expect(TOTAL_FRAMES).toBe(2400)
})

test('scenes are contiguous and start at frame 0', () => {
  expect(SCENES[0].from).toBe(0)
  SCENES.forEach((scene, index) => {
    if (index === 0) return
    const previous = SCENES[index - 1]
    expect(scene.from).toBe(previous.from + previous.durationInFrames)
  })
  const last = SCENES[SCENES.length - 1]
  expect(last.from + last.durationInFrames).toBe(TOTAL_FRAMES)
})

test('sceneRange returns the half-open range for a scene id', () => {
  expect(sceneRange('mark')).toEqual({ from: 1140, durationInFrames: 480 })
})
