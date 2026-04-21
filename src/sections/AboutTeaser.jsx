import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useContent } from '../context/ContentContext.jsx'

gsap.registerPlugin(ScrollTrigger)

export default function AboutTeaser() {
  const { content } = useContent()
  const teaser = content.aboutTeaser
  const about = content.about
  const clientSig = about.clients.join('|')
  const experienceSig = about.experience.map((item) => `${item.y}${item.r}`).join('|')
  const root = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.about-t__reveal', {
        y: 30,
        opacity: 0,
        duration: 0.9,
        ease: 'expo.out',
        stagger: 0.06,
        scrollTrigger: { trigger: root.current, start: 'top 80%' },
      })
      gsap.from('.about-t__client', {
        y: 18,
        opacity: 0,
        duration: 0.6,
        ease: 'expo.out',
        stagger: 0.02,
        scrollTrigger: { trigger: '.about-t__clients', start: 'top 85%' },
      })
      gsap.from('.about-t__xp-row', {
        y: 18,
        opacity: 0,
        duration: 0.65,
        ease: 'expo.out',
        stagger: 0.04,
        scrollTrigger: { trigger: '.about-t__xp', start: 'top 88%' },
      })
    }, root)
    return () => ctx.revert()
  }, [clientSig, experienceSig, teaser.heading, teaser.sub])

  return (
    <section ref={root} className="about-t">
      <div className="about-t__grid">
        <div className="about-t__intro">
          <span className="mono about-t__reveal">{teaser.eyebrow}</span>
          <p className="about-t__title about-t__reveal">{teaser.heading}</p>
          <p className="lede about-t__summary about-t__reveal">{teaser.sub}</p>
          <Link to="/about" className="about-t__link mono" data-cursor="link" data-cursor-label="Read more">
            <span>{teaser.ctaLabel}</span>
            <span>↗</span>
          </Link>
        </div>

        <div className="about-t__body">
          <div className="about-t__proof about-t__reveal">
            <span className="mono">{about.clientsEyebrow}</span>
            <p className="about-t__count">{about.clients.length}+</p>
            <p className="about-t__count-copy">
              clients, collaborators, and teams across product, systems, brand, and digital launches.
            </p>
          </div>

          <div className="about-t__clients">
            {about.clients.map((client) => (
              <span key={client} className="about-t__client mono">{client}</span>
            ))}
          </div>

          <div className="about-t__xp">
            <div className="about-t__xp-head">
              <span className="mono">{about.experienceHeading}</span>
            </div>
            <ul>
              {about.experience.map((item) => (
                <li key={`${item.y}-${item.r}`} className="about-t__xp-row">
                  <span className="mono">{item.y}</span>
                  <span>{item.r}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
