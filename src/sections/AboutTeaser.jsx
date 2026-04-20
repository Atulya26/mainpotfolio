import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from './splitText.js'
import { useContent } from '../context/ContentContext.jsx'

gsap.registerPlugin(ScrollTrigger)

export default function AboutTeaser() {
  const { content } = useContent()
  const at = content.aboutTeaser
  const root = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const lines = root.current.querySelectorAll('[data-split-scroll]')
      lines.forEach((l) => {
        const split = new SplitText(l)
        gsap.from(split.words, {
          yPercent: 110,
          duration: 0.9,
          ease: 'expo.out',
          stagger: 0.03,
          scrollTrigger: { trigger: l, start: 'top 85%' },
        })
      })
    }, root)
    return () => ctx.revert()
  }, [at.heading, at.sub])

  return (
    <section ref={root} className="about-t">
      <div className="about-t__grid">
        <div className="about-t__col">
          <span className="mono">{at.eyebrow}</span>
        </div>
        <div className="about-t__col about-t__body">
          <p className="h2" data-split-scroll>{at.heading}</p>
          <p className="lede" data-split-scroll>{at.sub}</p>
          <Link to="/about" className="about-t__link mono" data-cursor="link" data-cursor-label="Read more">
            <span>{at.ctaLabel}</span>
            <span>↗</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
