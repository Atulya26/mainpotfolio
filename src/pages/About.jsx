import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from '../sections/splitText.js'
import Footer from '../components/Footer.jsx'
import { useContent } from '../context/ContentContext.jsx'

gsap.registerPlugin(ScrollTrigger)

export default function About() {
  const { content } = useContent()
  const about = content.about
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
  }, [about.bio.join('|')])

  return (
    <div ref={root} className="about shell">
      <header className="about__head">
        <span className="mono">{about.eyebrow}</span>
        <h1 className="display about__big" data-split-scroll>{about.titleLine1}</h1>
        <h1 className="display about__big serif" data-split-scroll>{about.titleLine2}</h1>
      </header>

      <div className="about__bio">
        <div className="about__img">
          <img src={about.image} alt={content.site.name} />
          <span className="mono about__img-tag">{about.imageTag}</span>
        </div>
        <div className="about__text">
          {about.bio.map((p, i) => (
            <p key={i} className={i === 0 ? 'lede' : ''} data-split-scroll>{p}</p>
          ))}
        </div>
      </div>

      <section className="about__xp">
        <div className="about__xp-head">
          <span className="mono">Experience</span>
          <h2 className="h2">{about.experienceHeading}</h2>
        </div>
        <ul>
          {about.experience.map((x, i) => (
            <li key={i}>
              <span className="mono">{x.y}</span>
              <span>{x.r}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="about__clients">
        <span className="mono">{about.clientsEyebrow}</span>
        <p className="h2 about__clients-list">
          {about.clients.map((c, i) => (
            <span key={c}>
              {c}
              {i < about.clients.length - 1 ? ', ' : '.'}
            </span>
          ))}
        </p>
      </section>

      <Footer />
    </div>
  )
}
