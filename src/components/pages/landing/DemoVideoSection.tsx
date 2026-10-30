type DemoVideoSectionProps = { className?: string; style?: React.CSSProperties }

function DemoVideoSection({ className, style }: DemoVideoSectionProps) {
  return (
    <section id="demo" className={`scroll-mt-24 px-4 pb-24 sm:px-6 ${className ?? ''}`} style={style}>
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <h2 className="font-serif text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
            See it work
          </h2>
          <div className="mx-auto mt-8 h-1 w-16 bg-gold" />
          <p className="mx-auto mt-10 max-w-lg text-lg leading-relaxed text-slate">
            A 19-second look at a Sunday service — from the live registry to a clean close.
          </p>
        </div>

        <div className="mt-16 overflow-hidden rounded-section border border-line bg-paper shadow-section">
          <video
            className="aspect-video w-full block"
            src="/brag.mp4"
            poster="/brag-poster.jpg"
            controls
            preload="none"
            playsInline
          >
            <track kind="captions" src="/brag.vtt" srcLang="en" label="English" />
          </video>
        </div>
      </div>
    </section>
  )
}

export default DemoVideoSection
