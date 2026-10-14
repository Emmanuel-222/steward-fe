export type Caption = {
  from: number
  durationInFrames: number
  text: string
}

/**
 * One line per beat, in the product's voice. Timed to the scenes in
 * `timeline.ts`, not to the voiceover — so replacing the synthesised narration
 * with a real recording needs no re-timing.
 */
export const CAPTIONS: Caption[] = [
  { from: 30, durationInFrames: 150, text: 'The Registrar — church attendance and steward records.' },
  { from: 210, durationInFrames: 150, text: 'Sign in with your registrar credentials.' },
  { from: 390, durationInFrames: 210, text: 'See your stewards, meetings and engagement at a glance.' },
  { from: 630, durationInFrames: 270, text: 'Add your people — import a roster, or add them one by one.' },
  { from: 930, durationInFrames: 210, text: 'Create a meeting: date, time and type.' },
  { from: 1170, durationInFrames: 240, text: 'Mark a whole service in minutes.' },
  { from: 1410, durationInFrames: 210, text: 'Bulk-select the rest — or use rush mode.' },
  { from: 1650, durationInFrames: 150, text: 'Close the meeting for a clean record.' },
  { from: 1830, durationInFrames: 210, text: 'Excuses are filed by members and approved by leaders.' },
  { from: 2070, durationInFrames: 210, text: 'Run Workers-in-Training cohorts and assign teachers.' },
  { from: 2310, durationInFrames: 90, text: 'Ready when your church is.' },
]
