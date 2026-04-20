import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CAPABILITIES } from '../lib/data.js'

gsap.registerPlugin(ScrollTrigger)

// Sticky, cycling capabilities. As you scroll through the section, the big
// word on the left swaps while the list on the right highlights.
export default function Capabilities() {
  const root = useRef(null)
  const word = useRef(null)
  const itemsRef = useRef([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: root.current,
        start: 'top top',
        end: () => `+=${CAPABILITIES.length * 80}%`,
        pin: '.cap__sticky',
        scrub: 0.6,
        onUpdate: (self) => {
          const i = Math.min(
            CAPABILITIES.length - 1,
            Math.floor(self.progress * CAPABILITIES.length),
          )
          if (word.current) word.current.textContent = CAPABILITIES[i].k
          itemsRef.current.forEach((el, idx) => {
            el?.classList.toggle('is-active', idx === i)
          })
        },
      })

      gsap.from('.cap__lead', {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: 'expo.out',
        scrollTrigger: { trigger: root.current, start: 'top 70%' },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} className="cap">
      <div className="cap__sticky">
        <div className="cap__col">
          <p className="eyebrow cap__lead">(02) Capabilities</p>
          <h2 className="display cap__word">
            <span ref={word}>{CAPABILITIES[0].k}</span>
          </h2>
        </div>
        <ul className="cap__list">
          {CAPABILITIES.map((c, i) => (
            <li
              key={c.k}
              ref={(el) => (itemsRef.current[i] = el)}
              className={`cap__item ${i === 0 ? 'is-active' : ''}`}
            >
              <span className="mono">{String(i + 1).padStart(2, '0')}</span>
              <div>
                <h4>{c.k}</h4>
                <p>{c.v}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
