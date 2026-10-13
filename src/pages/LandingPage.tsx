import LandingNav from '../components/pages/landing/LandingNav'
import LandingHero from '../components/pages/landing/LandingHero'
import LandingFooter from '../components/pages/landing/LandingFooter'

function LandingPage() {
  return (
    <main className="min-h-screen bg-page-bg">
      <LandingNav />
      <LandingHero />
      <LandingFooter />
    </main>
  )
}

export default LandingPage
