import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useContent } from '../context/ContentContext.jsx'

gsap.registerPlugin(ScrollTrigger)

export default function Capabilities() {
  const { content } = useContent()
  const cap = content.capabilitiesSection
  const items = cap.items
  const root = useRef(null)
  const word = useRef(null)
  const itemsRef = useRef([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: root.current,
        start: 'top top',
        end: () => `+=${items.length * 80}%`,
        pin: '.cap__sticky',
        scrub: 0.6,
        onUpdate: (self) => {
          const i = Math.min(items.length - 1, Math.floor(self.progress * items.length))
          if (word.current) word.current.textContent = items[i].k
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
  }, [items.length, items.map((i) => i.k).join('|')])

  return (
    <section ref={root} className="cap">
      <div className="cap__sticky">
        <div className="cap__col">
          <p className="eyebrow cap__lead">{cap.eyebrow}</p>
          <h2 className="display cap__word">
            <span ref={word}>{items[0]?.k}</span>
          </h2>
        </div>
        <ul className="cap__list">
          {items.map((c, i) => (
            <li
              key={c.k + i}
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
