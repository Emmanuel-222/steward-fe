import { Play } from 'lucide-react'

function DemoVideoSection() {
  return (
    <section id="demo" className="scroll-mt-24 px-4 pb-20 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <h2 className="font-serif text-3xl font-semibold tracking-tight text-brand">
            See it work
          </h2>
          <div className="mx-auto mt-5 h-0.5 w-9 bg-signature" />
          <p className="mx-auto mt-5 max-w-lg text-sm leading-relaxed text-slate-600">
            A walkthrough from adding your people to closing a Sunday service.
          </p>
        </div>

        <div className="mt-10 flex aspect-video items-center justify-center rounded-card bg-brand shadow-heavy">
          <button
            type="button"
            aria-label="Play the demo"
            className="flex h-16 w-16 items-center justify-center rounded-full bg-signature text-brand transition hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          >
            <Play className="h-6 w-6 translate-x-0.5 fill-current" />
          </button>
        </div>
      </div>
    </section>
  )
}

export default DemoVideoSection
