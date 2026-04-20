import Hero from '../sections/Hero.jsx'
import FeaturedWork from '../sections/FeaturedWork.jsx'
import Capabilities from '../sections/Capabilities.jsx'
import Marquee from '../sections/Marquee.jsx'
import AboutTeaser from '../sections/AboutTeaser.jsx'
import Footer from '../components/Footer.jsx'

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <FeaturedWork />
      <Capabilities />
      <AboutTeaser />
      <Footer />
    </>
  )
}
