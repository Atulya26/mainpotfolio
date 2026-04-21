import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useContent } from '../context/ContentContext.jsx'

gsap.registerPlugin(ScrollTrigger)

export default function Awards() {
  const { content } = useContent()
  const awards = content.awards
  const root = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.awards-v__row', {
        y: 20,
        opacity: 0,
        duration: 0.7,
        ease: 'expo.out',
        stagger: 0.05,
        scrollTrigger: { trigger: root.current, start: 'top 82%' },
      })
    }, root)
    return () => ctx.revert()
  }, [awards?.items?.length])

  if (!awards) return null

  return (
    <section ref={root} className="awards-v">
      <div className="awards-v__head">
        <p className="eyebrow">{awards.eyebrow}</p>
      </div>
      <ul className="awards-v__list">
        {awards.items.map((a, i) => (
          <li key={i} className="awards-v__row">
            <span className="awards-v__year mono">{a.y}</span>
            <span className="awards-v__title">{a.t}</span>
            <span className="awards-v__where mono">{a.where}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
