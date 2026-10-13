import LandingNav from '../components/pages/landing/LandingNav'
import LandingHero from '../components/pages/landing/LandingHero'
import DemoVideoSection from '../components/pages/landing/DemoVideoSection'
import { WhatItDoes, HowItWorks, SundayRush, GetStartedBand } from '../components/pages/landing/FeatureSections'
import LandingFooter from '../components/pages/landing/LandingFooter'

function LandingPage() {
  return (
    <main className="min-h-screen bg-page-bg">
      <LandingNav />
      <LandingHero />
      <DemoVideoSection />
      <WhatItDoes />
      <HowItWorks />
      <SundayRush />
      <GetStartedBand />
      <LandingFooter />
    </main>
  )
}

export default LandingPage
