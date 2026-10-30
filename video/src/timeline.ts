export const FPS = 30
export const TOTAL_FRAMES = 2400

export const SCENES = [
  { id: 'intro', title: 'Cold open', from: 0, durationInFrames: 180 },
  { id: 'signin', title: 'Sign in', from: 180, durationInFrames: 180 },
  { id: 'overview', title: 'The overview', from: 360, durationInFrames: 240 },
  { id: 'people', title: 'Add your people', from: 600, durationInFrames: 300 },
  { id: 'meeting', title: 'Create a meeting', from: 900, durationInFrames: 240 },
  { id: 'mark', title: 'Mark the service', from: 1140, durationInFrames: 480 },
  { id: 'close', title: 'Close and report', from: 1620, durationInFrames: 180 },
  { id: 'excuses', title: 'Excuses', from: 1800, durationInFrames: 240 },
  { id: 'training', title: 'Workers-in-Training', from: 2040, durationInFrames: 240 },
  { id: 'outro', title: 'Outro', from: 2280, durationInFrames: 120 },
] as const

export type SceneId = (typeof SCENES)[number]['id']

export function sceneRange(id: string) {
  const scene = SCENES.find((candidate) => candidate.id === id)
  if (!scene) throw new Error(`Unknown scene: ${id}`)
  return { from: scene.from, durationInFrames: scene.durationInFrames }
}
