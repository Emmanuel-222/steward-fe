import LandingNav from '../components/pages/landing/LandingNav'
import LandingHero from '../components/pages/landing/LandingHero'
import DemoVideoSection from '../components/pages/landing/DemoVideoSection'
import { WhatItDoes, HowItWorks, SundayRush, GetStartedBand } from '../components/pages/landing/FeatureSections'
import LandingFaq from '../components/pages/landing/LandingFaq'
import LandingFooter from '../components/pages/landing/LandingFooter'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

function LandingPage() {
  useDocumentTitle('The Registrar — Church attendance & steward records')

  return (
    <main className="min-h-screen bg-parchment">
      <LandingNav />
      <LandingHero className="animate-page-load" />
      <DemoVideoSection className="animate-reveal-up" style={{ animationDelay: '100ms' }} />
      <WhatItDoes className="animate-reveal-up" style={{ animationDelay: '200ms' }} />
      <HowItWorks className="animate-reveal-up" style={{ animationDelay: '300ms' }} />
      <SundayRush className="animate-reveal-up" style={{ animationDelay: '400ms' }} />
      <GetStartedBand className="animate-reveal-up" style={{ animationDelay: '500ms' }} />
      <LandingFaq className="animate-reveal-up" style={{ animationDelay: '600ms' }} />
      <LandingFooter className="animate-reveal-up" style={{ animationDelay: '700ms' }} />
    </main>
  )
}

export default LandingPage
