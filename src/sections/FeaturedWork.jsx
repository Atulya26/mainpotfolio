import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { PROJECTS, CATEGORIES } from '../lib/data.js'

gsap.registerPlugin(ScrollTrigger)

export default function FeaturedWork() {
  const root = useRef(null)
  const [filter, setFilter] = useState('All')
  const items = filter === 'All' ? PROJECTS : PROJECTS.filter((p) => p.category === filter)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = root.current.querySelectorAll('.pc')
      cards.forEach((card) => {
        gsap.from(card.querySelector('.pc__img'), {
          scale: 1.15,
          yPercent: 8,
          ease: 'none',
          scrollTrigger: {
            trigger: card,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        })
        gsap.from(card, {
          y: 40,
          opacity: 0,
          duration: 1.1,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
          },
        })
      })

      gsap.from('.fw__heading-el', {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: 'expo.out',
        stagger: 0.06,
        scrollTrigger: { trigger: '.fw__heading', start: 'top 80%' },
      })
    }, root)
    return () => ctx.revert()
  }, [filter])

  return (
    <section ref={root} className="fw" id="selected">
      <div className="fw__heading">
        <span className="mono fw__heading-el">(01) Selected works · 2022—26</span>
        <h2 className="h2 fw__heading-el">
          A handful of projects I'm still
          <br />
          quietly proud of.
        </h2>
      </div>

      <div className="fw__filters mono">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`fw__filter ${filter === c ? 'is-active' : ''}`}
            data-cursor="button"
          >
            <span>{c}</span>
            <span className="fw__filter-count">
              {c === 'All' ? PROJECTS.length : PROJECTS.filter((p) => p.category === c).length}
            </span>
          </button>
        ))}
      </div>

      <ul className="fw__list">
        {items.map((p, i) => (
          <li key={p.slug} className={`pc ${i % 2 ? 'pc--right' : 'pc--left'}`}>
            <Link
              to={`/work/${p.slug}`}
              className="pc__link"
              data-cursor="case"
              data-cursor-label="View case"
            >
              <div className="pc__top">
                <span className="mono">{p.index}</span>
                <span className="mono">{p.year}</span>
              </div>
              <div className="pc__img-wrap" style={{ background: p.color }}>
                <img className="pc__img" src={p.cover} alt={p.client} />
                <span className="pc__discipline mono" style={{ color: p.textOnColor }}>
                  {p.discipline}
                </span>
              </div>
              <div className="pc__meta">
                <h3 className="pc__title">
                  <span className="pc__client">{p.client}</span>
                  <span className="pc__hyphen">—</span>
                  <span className="pc__headline">{p.title}</span>
                </h3>
                <div className="pc__roles mono">
                  {p.role.map((r) => (
                    <span key={r}>{r}</span>
                  ))}
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <div className="fw__foot">
        <Link to="/archive" className="fw__all mono" data-cursor="link" data-cursor-label="All work">
          <span>See full archive (56)</span>
          <span>↗</span>
        </Link>
      </div>
    </section>
  )
}
