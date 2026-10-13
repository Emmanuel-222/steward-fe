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
    <main className="min-h-screen bg-page-bg">
      <LandingNav />
      <LandingHero />
      <DemoVideoSection />
      <WhatItDoes />
      <HowItWorks />
      <SundayRush />
      <GetStartedBand />
      <LandingFaq />
      <LandingFooter />
    </main>
  )
}

export default LandingPage
