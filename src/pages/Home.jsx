import Hero from '../sections/Hero.jsx'
import FeaturedWork from '../sections/FeaturedWork.jsx'
import Services from '../sections/Services.jsx'
import Stats from '../sections/Stats.jsx'
import Awards from '../sections/Awards.jsx'
import UIShowcase from '../sections/UIShowcase.jsx'
import Marquee from '../sections/Marquee.jsx'
import AboutTeaser from '../sections/AboutTeaser.jsx'
import Footer from '../components/Footer.jsx'

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedWork />
      <Services />
      <Stats />
      <UIShowcase />
      <Awards />
      <AboutTeaser />
      <Marquee />
      <Footer />
    </>
  )
}
