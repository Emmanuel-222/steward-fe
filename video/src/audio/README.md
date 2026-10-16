# Voiceover

The narration lives at `video/public/audio/voiceover.mp3` — Remotion's
`staticFile('audio/voiceover.mp3')` resolves from the project's `public/`
directory, not from `src/`.

It is **on by default**: `Root.tsx` sets `defaultProps={{ voiceover: true }}`,
so a normal render includes it.

- **Length:** 64.3 s (mono, 44.1 kHz MP3). The video is 80 s, so the last
  ~16 s — the rest of *Excuses*, all of *Workers-in-Training* and the outro —
  runs with captions but no narration.
- **To render silently** (e.g. to check visuals): pass
  `--props={"voiceover":false}`.
- **To replace the voice:** overwrite `public/audio/voiceover.mp3` and
  re-render. Captions are timed to `src/captions.ts`, not to the audio, so
  swapping the voice needs no re-timing.
