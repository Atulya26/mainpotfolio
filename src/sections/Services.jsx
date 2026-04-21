import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useContent } from '../context/ContentContext.jsx'

gsap.registerPlugin(ScrollTrigger)

export default function Services() {
  const { content } = useContent()
  const services = content.services
  const capabilities = content.capabilitiesSection?.items || []
  const root = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.services-v__head-el', {
        y: 30,
        opacity: 0,
        duration: 0.9,
        ease: 'expo.out',
        stagger: 0.08,
        scrollTrigger: { trigger: root.current, start: 'top 82%' },
      })
      gsap.from('.services-v__item', {
        y: 24,
        opacity: 0,
        duration: 0.7,
        ease: 'expo.out',
        stagger: 0.04,
        scrollTrigger: { trigger: root.current, start: 'top 78%' },
      })
    }, root)
    return () => ctx.revert()
  }, [capabilities.length, services?.items?.length])

  if (!services) return null

  return (
    <section ref={root} className="services-v">
      <div className="services-v__grid">
        <div className="services-v__head">
          <p className="eyebrow services-v__head-el">{services.eyebrow}</p>
          <h2 className="services-v__title services-v__head-el">{services.heading}</h2>
          <p className="services-v__copy services-v__head-el">
            {services.intro ||
              'I help teams turn product strategy into interfaces that feel coherent, restrained, and ready to ship. The work usually spans systems, screens, and the narrative that ties them together.'}
          </p>
          <div className="services-v__tags mono services-v__head-el">
            {services.items.map((item) => (
              <span key={item} className="services-v__tag">{item}</span>
            ))}
          </div>
        </div>

        <ul className="services-v__list">
          {capabilities.map((item, i) => (
            <li key={item.k} className="services-v__item">
              <span className="mono services-v__num">{String(i + 1).padStart(2, '0')}</span>
              <div className="services-v__body">
                <h3 className="services-v__label">{item.k}</h3>
                <p>{item.v}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
