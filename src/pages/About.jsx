import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from '../sections/splitText.js'
import Footer from '../components/Footer.jsx'

gsap.registerPlugin(ScrollTrigger)

const EXPERIENCE = [
  { y: '2024 — now', r: 'Independent — Design practice, Copenhagen' },
  { y: '2020 — 24', r: 'Senior Product Designer — Something Studio' },
  { y: '2017 — 20', r: 'Designer — Another Studio' },
  { y: '2015 — 17', r: 'Visual Designer — Small Agency, Mumbai' },
]

const CLIENTS = [
  'Pointvoucher', 'BioInnovation Institute', 'Recommendating', 'Rasmus Noah Hansen',
  'Field & Form', 'Northbound', 'Still Magazine', 'Sundayhouse', 'Mellow Pay', 'Harbour',
  'Kiln Reader', 'Folio Editorial', 'Ø Radio',
]

export default function About() {
  const root = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const lines = root.current.querySelectorAll('[data-split-scroll]')
      lines.forEach((l) => {
        const split = new SplitText(l)
        gsap.from(split.words, {
          yPercent: 110,
          duration: 0.9,
          ease: 'expo.out',
          stagger: 0.03,
          scrollTrigger: { trigger: l, start: 'top 85%' },
        })
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={root} className="about shell">
      <header className="about__head">
        <span className="mono">(04) About</span>
        <h1 className="display about__big" data-split-scroll>
          A designer who prefers
        </h1>
        <h1 className="display about__big serif" data-split-scroll>
          quiet confidence.
        </h1>
      </header>

      <div className="about__bio">
        <div className="about__img">
          <img
            src="https://images.unsplash.com/photo-1527436826045-8805c615a6df?w=1000&q=80&auto=format&fit=crop"
            alt="Atulya"
          />
          <span className="mono about__img-tag">Cph · 2026</span>
        </div>
        <div className="about__text">
          <p className="lede" data-split-scroll>
            Hi — I'm Atulya. I design products and identities that try to do
            less, better. My work sits at the intersection of interaction,
            type and tone. I care about legibility, pacing, and the small
            sound a button makes when it's been considered.
          </p>
          <p data-split-scroll>
            I grew up between cities — Mumbai, Berlin, Copenhagen — and
            most of what I know I learned from the people around me.
            Before going independent I spent eight years in product
            studios, shipping across finance, health, media and the quiet
            kind of consumer apps you keep on your home screen.
          </p>
          <p data-split-scroll>
            Outside of client work I write essays, teach the occasional
            workshop, and keep a shelf of handmade notebooks that never
            quite get used.
          </p>
        </div>
      </div>

      <section className="about__xp">
        <div className="about__xp-head">
          <span className="mono">Experience</span>
          <h2 className="h2">Short version</h2>
        </div>
        <ul>
          {EXPERIENCE.map((x) => (
            <li key={x.y}>
              <span className="mono">{x.y}</span>
              <span>{x.r}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="about__clients">
        <span className="mono">Selected clients</span>
        <p className="h2 about__clients-list">
          {CLIENTS.map((c, i) => (
            <span key={c}>
              {c}
              {i < CLIENTS.length - 1 ? ', ' : '.'}
            </span>
          ))}
        </p>
      </section>

      <Footer />
    </div>
  )
}
