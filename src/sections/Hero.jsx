import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { SplitText } from './splitText.js'
import { useContent } from '../context/ContentContext.jsx'

export default function Hero() {
  const { content } = useContent()
  const hero = content.hero
  const root = useRef(null)
  const mediaRef = useRef(null)
  const scrollHint = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const lines = root.current.querySelectorAll('[data-split]')
      lines.forEach((l) => {
        const split = new SplitText(l)
        gsap.from(split.words, {
          yPercent: 110,
          duration: 1.1,
          ease: 'expo.out',
          stagger: 0.04,
          delay: 0.4,
        })
      })

      gsap.from(root.current.querySelectorAll('[data-fade]'), {
        opacity: 0,
        y: 20,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.08,
        delay: 0.9,
      })

      gsap.from(mediaRef.current, { scale: 1.08, duration: 1.6, ease: 'expo.out', delay: 0.2 })
      gsap.to(scrollHint.current, { y: 10, duration: 1.2, ease: 'sine.inOut', yoyo: true, repeat: -1 })
    }, root)
    return () => ctx.revert()
  }, [hero.titleLines.join('|'), hero.mediaSrc])

  return (
    <section ref={root} className="hero">
      <div className="hero__meta mono" data-fade>
        <span>{hero.metaLeft}</span>
        <span>{hero.metaRight}</span>
      </div>

      <h1 className="hero__title display">
        {hero.titleLines.map((line, i) => (
          <span className="hero__line" data-split key={i}>
            {line}
          </span>
        ))}
      </h1>

      <div className="hero__bottom">
        <div className="hero__media" ref={mediaRef} data-cursor="media" data-cursor-label="Showreel">
          <img src={hero.mediaSrc} alt="" />
          <span className="hero__media-tag mono">{hero.mediaTag}</span>
          <span className="hero__media-play" aria-hidden>▶</span>
        </div>

        <div className="hero__aside" data-fade>
          <p className="lede">{hero.asideLede}</p>
          <div className="hero__ticker mono">
            {hero.ticker.map((t, i) => (
              <span key={i}>{t}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="hero__scroll mono" ref={scrollHint}>
        <span>{hero.scrollHint}</span>
        <svg width="10" height="14" viewBox="0 0 10 14" fill="none">
          <path d="M5 0v13m0 0L1 9m4 4l4-4" stroke="currentColor" />
        </svg>
      </div>
    </section>
  )
}
