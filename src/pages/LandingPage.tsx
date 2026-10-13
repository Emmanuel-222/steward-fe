import LandingNav from '../components/pages/landing/LandingNav'
import LandingHero from '../components/pages/landing/LandingHero'
import DemoVideoSection from '../components/pages/landing/DemoVideoSection'
import LandingFooter from '../components/pages/landing/LandingFooter'

function LandingPage() {
  return (
    <main className="min-h-screen bg-page-bg">
      <LandingNav />
      <LandingHero />
      <DemoVideoSection />
      <LandingFooter />
    </main>
  )
}

export default LandingPage
