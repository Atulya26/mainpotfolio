import { useEffect, useMemo, useRef } from 'react'
import gsap from 'gsap'
import { ArrowRight } from 'lucide-react'
import { SplitText } from './splitText.js'
import { useContent } from '../context/ContentContext.jsx'

export default function Hero() {
  const { content } = useContent()
  const hero = content.hero
  const site = content.site
  const projects = content.projects
  const disciplines = useMemo(() => {
    const capabilityItems = content.capabilitiesSection?.items?.map((item) => item.k) || []
    const serviceItems = content.services?.items || []
    return (capabilityItems.length ? capabilityItems : serviceItems).slice(0, 4)
  }, [content.capabilitiesSection?.items, content.services?.items])

  const titleSig = hero.titleLines.join('|')
  const root = useRef(null)
  const scrollHint = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const lines = root.current.querySelectorAll('[data-split]')
      lines.forEach((line) => {
        const split = new SplitText(line)
        gsap.from(split.words, {
          yPercent: 110,
          duration: 1.1,
          ease: 'expo.out',
          stagger: 0.04,
          delay: 0.4,
        })
      })

      gsap.from(root.current.querySelectorAll('[data-fade]'), {
        opacity: 0,
        y: 20,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.08,
        delay: 0.9,
      })

      gsap.to(scrollHint.current, { y: 10, duration: 1.2, ease: 'sine.inOut', yoyo: true, repeat: -1 })
    }, root)
    return () => ctx.revert()
  }, [titleSig])

  return (
    <section ref={root} className="hero-v">
      <div className="hero-v__meta mono" data-fade>
        <div className="hero-v__meta-group">
          <a href={`tel:${site.phone}`} className="hero-v__meta-item">{site.phone}</a>
          <a href={`mailto:${site.email}`} className="hero-v__meta-item">{site.email}</a>
        </div>
        <div className="hero-v__meta-group">
          <span className="hero-v__meta-item hero-v__meta-status">
            <span className="hero-v__dot" aria-hidden />
            {hero.availabilityStatus || 'Available for hire'}
          </span>
          <span className="hero-v__meta-item">{hero.projectsCount || `Projects (${projects.length})`}</span>
        </div>
      </div>

      <div className="hero-v__headline">
        <p className="eyebrow hero-v__eyebrow" data-fade>
          {hero.metaLeft || `${site.name} — ${site.role}`}
        </p>
        <h1 className="hero-v__title">
          {hero.titleLines.map((line, i) => (
            <span className="hero-v__line" data-split key={i}>
              {line}
            </span>
          ))}
        </h1>
      </div>

      <div className="hero-v__intro-row" data-fade>
        <div className="hero-v__intro-block">
          <p className="hero-v__intro">
            {hero.intro ||
              'Independent product and interaction designer. I work at the seam of product, brand and motion — currently shipping small, honest things.'}
          </p>

          {disciplines.length > 0 && (
            <div className="hero-v__disciplines mono">
              {disciplines.map((item) => (
                <span key={item} className="hero-v__discipline">{item}</span>
              ))}
            </div>
          )}
        </div>

        <div className="hero-v__aside">
          <a href="#selected" className="hero-v__cta" data-cursor="link" data-cursor-label="Selected work">
            <span>Selected work</span>
            <ArrowRight className="hero-v__cta-icon" />
          </a>

          <div className="hero-v__scroll mono" ref={scrollHint}>
            <span>{hero.scrollHint || 'Scroll'}</span>
            <svg width="10" height="14" viewBox="0 0 10 14" fill="none">
              <path d="M5 0v13m0 0L1 9m4 4l4-4" stroke="currentColor" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  )
}
