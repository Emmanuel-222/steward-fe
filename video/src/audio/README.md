# Voiceover

The narration starts as a synthesised voice. To replace it with a real
recording:

1. Drop the file in as `voiceover.mp3` in this folder.
2. Render with the voice enabled:

   ```bash
   npx remotion render src/index.ts Demo ../public/demo.mp4 --port=3100 \
     --props='{"voiceover":true}'
   ```

The composition renders silently without `voiceover: true`, so the video can be
built before the voice is recorded.

**Captions are timed to `src/captions.ts`, not to this audio.** Swapping the
voice needs no re-timing — only the audio file changes.
