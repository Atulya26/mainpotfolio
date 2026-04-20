import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { PUBLISHED } from '../lib/data.js'
import Footer from '../components/Footer.jsx'

export default function Published() {
  const root = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.pub__item', {
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: 'expo.out',
        stagger: 0.06,
        delay: 0.4,
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={root} className="pub shell">
      <header className="pub__head">
        <span className="mono">(03) Published</span>
        <h1 className="h2">
          Essays, talks and the odd <br />
          argument with myself.
        </h1>
      </header>

      <ul className="pub__list">
        {PUBLISHED.map((p, i) => (
          <li key={i} className="pub__item" data-cursor="link" data-cursor-label="Read">
            <a href="#" className="pub__link">
              <span className="mono pub__num">{String(i + 1).padStart(2, '0')}</span>
              <div className="pub__body">
                <h3 className="pub__title">{p.t}</h3>
                <span className="mono pub__meta">
                  {p.where} · {p.y}
                </span>
              </div>
              <span className="pub__arrow">↗</span>
            </a>
          </li>
        ))}
      </ul>

      <Footer />
    </div>
  )
}
