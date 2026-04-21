import { useEffect, useMemo, useRef } from 'react'
import gsap from 'gsap'
import { ArrowUpRight, ArrowLeft, ArrowRight } from 'lucide-react'
import { SplitText } from './splitText.js'
import { useContent } from '../context/ContentContext.jsx'

export default function Hero() {
  const { content } = useContent()
  const hero = content.hero
  const site = content.site
  const projects = content.projects
  const showcaseProjects = useMemo(() => projects.slice(0, 6), [projects])
  const hasShowcaseUrl = Boolean(hero.showcaseUrl && hero.showcaseUrl !== '#')

  const titleSig = hero.titleLines.join('|')
  const showcaseSig = showcaseProjects.map((project) => project.slug).join('|')

  const root = useRef(null)
  const scrollHint = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const lines = root.current.querySelectorAll('[data-split]')
      lines.forEach((l) => {
        const split = new SplitText(l)
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
      {/* Meta strip — phone / email / availability / count */}
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

      {/* Big stacked display name */}
      <h1 className="hero-v__title">
        {hero.titleLines.map((line, i) => (
          <span className="hero-v__line" data-split key={i}>
            {line}
          </span>
        ))}
      </h1>

      {/* Intro paragraph + CTA */}
      <div className="hero-v__intro-row" data-fade>
        <p className="hero-v__intro">
          {hero.intro ||
            'Independent product and interaction designer. I work at the seam of product, brand and motion — currently shipping small, honest things.'}
        </p>
        <a href="#selected" className="hero-v__cta" data-cursor="link" data-cursor-label="Selected work">
          <span>Selected work</span>
          <ArrowRight className="hero-v__cta-icon" />
        </a>
      </div>

      {/* Scroll hint */}
      <div className="hero-v__scroll mono" ref={scrollHint}>
        <span>{hero.scrollHint || 'Scroll'}</span>
        <svg width="10" height="14" viewBox="0 0 10 14" fill="none">
          <path d="M5 0v13m0 0L1 9m4 4l4-4" stroke="currentColor" />
        </svg>
      </div>
    </section>
  )
}
