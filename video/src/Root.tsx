import { Audio, Composition, Sequence, staticFile } from 'remotion'
import { loadFont as loadSpectral } from '@remotion/google-fonts/Spectral'
import { loadFont as loadInter } from '@remotion/google-fonts/Inter'
import { FPS, TOTAL_FRAMES, sceneRange } from './timeline'
import { CAPTIONS } from './captions'
import { Caption } from './components/Caption'
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

type DemoProps = {
  voiceover?: boolean
}

function Captions() {
  return (
    <>
      {CAPTIONS.map((caption) => (
        <Sequence key={caption.from} from={caption.from} durationInFrames={caption.durationInFrames}>
          <Caption>{caption.text}</Caption>
        </Sequence>
      ))}
    </>
  )
}

function Demo({ voiceover = false }: DemoProps) {
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

      <Captions />

      {voiceover ? <Audio src={staticFile('audio/voiceover.mp3')} /> : null}
    </>
  )
}

export function RemotionRoot() {
  return (
    <Composition
      id="Demo"
      component={Demo}
      defaultProps={{ voiceover: false }}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      width={1920}
      height={1080}
    />
  )
}
