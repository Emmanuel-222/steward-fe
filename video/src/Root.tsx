import { Composition } from 'remotion'
import { Hello } from './Hello'

export function RemotionRoot() {
  return (
    <Composition
      id="Demo"
      component={Hello}
      durationInFrames={90}
      fps={30}
      width={1920}
      height={1080}
    />
  )
}
