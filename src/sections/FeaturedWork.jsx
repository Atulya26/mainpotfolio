import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight } from 'lucide-react'
import { useContent } from '../context/ContentContext.jsx'

gsap.registerPlugin(ScrollTrigger)

export default function FeaturedWork() {
  const { content } = useContent()
  const projects = content.projects.slice(0, 4)
  const root = useRef(null)
  const thumbRef = useRef(null)
  const [hover, setHover] = useState(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.fwv__heading-el', {
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: 'expo.out',
        stagger: 0.06,
        scrollTrigger: { trigger: '.fwv__heading', start: 'top 82%' },
      })
      gsap.from('.fwv__row', {
        y: 30,
        opacity: 0,
        duration: 0.7,
        ease: 'expo.out',
        stagger: 0.04,
        scrollTrigger: { trigger: '.fwv__list', start: 'top 82%' },
      })
    }, root)
    return () => ctx.revert()
  }, [projects.length])

  useEffect(() => {
    const onMove = (event) => {
      if (!thumbRef.current) return
      thumbRef.current.style.setProperty('--x', `${event.clientX}px`)
      thumbRef.current.style.setProperty('--y', `${event.clientY}px`)
    }
    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  return (
    <section ref={root} className="fwv" id="selected">
      <div className="fwv__heading">
        <p className="eyebrow fwv__heading-el">{content.featured.eyebrow}</p>
        <h2 className="fwv__title fwv__heading-el" style={{ whiteSpace: 'pre-line' }}>
          {content.featured.heading}
        </h2>
        <p className="fwv__sub fwv__heading-el">
          {content.featured.sub ||
            'A tighter edit of product work, interface systems, and websites built to feel intentional once they ship.'}
        </p>
      </div>

      <ul className="fwv__list">
        {projects.map((project) => (
          <li key={project.slug} className="fwv__row">
            <Link
              to={`/work/${project.slug}`}
              className="fwv__link"
              onMouseEnter={() => setHover(project)}
              onMouseLeave={() => setHover(null)}
              data-cursor="case"
              data-cursor-label="View case"
            >
              <span className="fwv__index mono">{project.index}</span>
              <span className="fwv__client">{project.client}</span>
              <div className="fwv__summary">
                <span className="fwv__tag mono">{project.category}</span>
                <span className="fwv__headline">{project.summary}</span>
              </div>
              <span className="fwv__year mono">{project.year}</span>
              <span className="fwv__arrow">
                <ArrowUpRight />
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="fwv__foot">
        <Link to="/archive" className="fwv__all mono" data-cursor="link" data-cursor-label="All work">
          <span>{content.featured.ctaLabel || 'See full archive'}</span>
          <ArrowUpRight className="fwv__all-icon" />
        </Link>
      </div>

      <div ref={thumbRef} className={`fwv__thumb ${hover ? 'is-on' : ''}`} aria-hidden>
        {hover && (
          <div className="fwv__thumb-inner" style={{ background: hover.color }}>
            <img src={hover.cover} alt="" />
          </div>
        )}
      </div>
    </section>
  )
}
