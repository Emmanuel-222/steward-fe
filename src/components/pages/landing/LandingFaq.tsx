import { FAQS } from '../../../features/landing/content'

function LandingFaq() {
  return (
    <section className="bg-white px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-2xl">
        <div className="text-center">
          <h2 className="font-serif text-3xl font-semibold tracking-tight text-brand">Questions</h2>
          <div className="mx-auto mt-5 h-0.5 w-9 bg-signature" />
        </div>

        <dl className="mt-12 divide-y divide-slate-100">
          {FAQS.map((faq) => (
            <div key={faq.q} className="py-5">
              <dt className="text-sm font-bold text-brand">{faq.q}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-slate-600">{faq.a}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

export default LandingFaq
