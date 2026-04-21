import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight } from 'lucide-react'
import { useContent } from '../context/ContentContext.jsx'

gsap.registerPlugin(ScrollTrigger)

// Verris-style featured work: hairline-divided rows with hover thumbnails.
// Label on the left (client + meta), hoverable thumbnail tracking the cursor.
export default function FeaturedWork() {
  const { content } = useContent()
  const projects = content.projects
  const categories = content.categories
  const root = useRef(null)
  const thumbRef = useRef(null)
  const [filter, setFilter] = useState('All')
  const [hover, setHover] = useState(null)
  const items = filter === 'All' ? projects : projects.filter((p) => p.category === filter)

  // Fade in heading + rows
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
  }, [filter, items.length])

  // Cursor-following thumbnail
  useEffect(() => {
    const onMove = (e) => {
      if (!thumbRef.current) return
      thumbRef.current.style.setProperty('--x', `${e.clientX}px`)
      thumbRef.current.style.setProperty('--y', `${e.clientY}px`)
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
      </div>

      <div className="fwv__filters">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`fwv__filter mono ${filter === c ? 'is-active' : ''}`}
            data-cursor="button"
          >
            <span>{c}</span>
            <span className="fwv__filter-count">
              {c === 'All' ? projects.length : projects.filter((p) => p.category === c).length}
            </span>
          </button>
        ))}
      </div>

      <ul className="fwv__list">
        {items.map((p, i) => (
          <li key={p.slug} className="fwv__row">
            <Link
              to={`/work/${p.slug}`}
              className="fwv__link"
              onMouseEnter={() => setHover(p)}
              onMouseLeave={() => setHover(null)}
              data-cursor="case"
              data-cursor-label="View case"
            >
              <span className="fwv__index mono">{String(i + 1).padStart(2, '0')}</span>
              <span className="fwv__client">{p.client}</span>
              <span className="fwv__headline">{p.title}</span>
              <span className="fwv__cat mono">{p.category}</span>
              <span className="fwv__year mono">{p.year}</span>
              <span className="fwv__arrow">
                <ArrowUpRight />
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="fwv__foot">
        <Link to="/archive" className="fwv__all mono" data-cursor="link" data-cursor-label="All work">
          <span>{content.featured.ctaLabel}</span>
          <ArrowUpRight className="fwv__all-icon" />
        </Link>
      </div>

      {/* Cursor-follow thumbnail */}
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
