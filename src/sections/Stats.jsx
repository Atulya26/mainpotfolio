import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useContent } from '../context/ContentContext.jsx'

gsap.registerPlugin(ScrollTrigger)

export default function Stats() {
  const { content } = useContent()
  const stats = content.stats
  const root = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.stats-v__item', {
        y: 30,
        opacity: 0,
        duration: 0.9,
        ease: 'expo.out',
        stagger: 0.08,
        scrollTrigger: { trigger: root.current, start: 'top 80%' },
      })
    }, root)
    return () => ctx.revert()
  }, [stats?.items?.length])

  if (!stats) return null

  return (
    <section ref={root} className="stats-v">
      <p className="eyebrow stats-v__eyebrow">{stats.eyebrow}</p>
      <div className="stats-v__grid">
        {stats.items.map((s, i) => (
          <div key={i} className="stats-v__item">
            <p className="stats-v__value">{s.v}</p>
            <p className="stats-v__label mono">{s.l}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
