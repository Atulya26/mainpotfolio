import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useContent } from '../context/ContentContext.jsx'

gsap.registerPlugin(ScrollTrigger)

export default function Stats() {
  const { content } = useContent()
  const stats = content.stats
  const about = content.about
  const lead = (stats?.items || []).find((item) => /year|practice/i.test(item.l)) || stats?.items?.[0]
  const rest = (stats?.items || []).filter((item) => item !== lead)
  const root = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.stats-v__lead-el', {
        y: 32,
        opacity: 0,
        duration: 0.9,
        ease: 'expo.out',
        stagger: 0.06,
        scrollTrigger: { trigger: root.current, start: 'top 82%' },
      })
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
      <div className="stats-v__lead">
        <div className="stats-v__copy-block">
          <p className="eyebrow stats-v__lead-el">{stats.eyebrow}</p>
          <div className="stats-v__hero">
            <p className="stats-v__value stats-v__lead-el">{lead?.v}</p>
            <div className="stats-v__hero-copy">
              <h2 className="stats-v__headline stats-v__lead-el">{lead?.l}</h2>
              <p className="stats-v__copy stats-v__lead-el">
                {about?.bio?.[0] ||
                  'I design products and identities that try to do less, better, with a focus on legibility, pacing, and systems that survive real use.'}
              </p>
            </div>
          </div>
        </div>

        {about?.image && (
          <div className="stats-v__portrait stats-v__lead-el">
            <img src={about.image} alt={content.site.name} />
            {about.imageTag && <span className="mono stats-v__portrait-tag">{about.imageTag}</span>}
          </div>
        )}
      </div>

      <div className="stats-v__grid">
        {rest.map((item, i) => (
          <div key={i} className="stats-v__item">
            <p className="stats-v__metric">{item.v}</p>
            <p className="stats-v__label mono">{item.l}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
