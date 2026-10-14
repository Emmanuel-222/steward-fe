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

        <div className="mt-10 overflow-hidden rounded-card bg-brand shadow-heavy">
          <video
            className="aspect-video w-full"
            src="/demo.mp4"
            poster="/demo-poster.jpg"
            controls
            preload="none"
            playsInline
          >
            <track kind="captions" src="/demo.vtt" srcLang="en" label="English" default />
          </video>
        </div>
      </div>
    </section>
  )
}

export default DemoVideoSection
