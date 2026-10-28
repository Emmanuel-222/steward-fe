import { FAQS } from '../../../features/landing/content'

type LandingFaqProps = { className?: string; style?: React.CSSProperties }

function LandingFaq({ className, style }: LandingFaqProps) {
  return (
    <section className={`bg-paper px-4 py-24 sm:px-6 ${className ?? ''}`} style={style}>
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <h2 className="font-serif text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
            Questions
          </h2>
          <div className="mx-auto mt-8 h-1 w-20 bg-gold" />
        </div>

        <dl className="mt-16 divide-y divide-line">
          {FAQS.map((faq) => (
            <div key={faq.q} className="py-6">
              <dt className="text-sm font-semibold text-ink">{faq.q}</dt>
              <dd className="mt-3 text-lg leading-relaxed text-slate">{faq.a}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

export default LandingFaq
