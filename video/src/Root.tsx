import { Composition, Sequence } from 'remotion'
import { loadFont as loadSpectral } from '@remotion/google-fonts/Spectral'
import { loadFont as loadInter } from '@remotion/google-fonts/Inter'
import { FPS, TOTAL_FRAMES, sceneRange } from './timeline'
import { Intro } from './scenes/Intro'
import { SignIn } from './scenes/SignIn'
import { Overview } from './scenes/Overview'
import { People } from './scenes/People'
import { Meeting } from './scenes/Meeting'
import { Mark } from './scenes/Mark'
import { Close } from './scenes/Close'
import { Excuses } from './scenes/Excuses'
import { Training } from './scenes/Training'
import { Outro } from './scenes/Outro'

loadSpectral()
loadInter()

function Demo() {
  return (
    <>
      <Sequence {...sceneRange('intro')}>
        <Intro />
      </Sequence>
      <Sequence {...sceneRange('signin')}>
        <SignIn />
      </Sequence>
      <Sequence {...sceneRange('overview')}>
        <Overview />
      </Sequence>
      <Sequence {...sceneRange('people')}>
        <People />
      </Sequence>
      <Sequence {...sceneRange('meeting')}>
        <Meeting />
      </Sequence>
      <Sequence {...sceneRange('mark')}>
        <Mark />
      </Sequence>
      <Sequence {...sceneRange('close')}>
        <Close />
      </Sequence>
      <Sequence {...sceneRange('excuses')}>
        <Excuses />
      </Sequence>
      <Sequence {...sceneRange('training')}>
        <Training />
      </Sequence>
      <Sequence {...sceneRange('outro')}>
        <Outro />
      </Sequence>
    </>
  )
}

export function RemotionRoot() {
  return (
    <Composition
      id="Demo"
      component={Demo}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      width={1920}
      height={1080}
    />
  )
}
