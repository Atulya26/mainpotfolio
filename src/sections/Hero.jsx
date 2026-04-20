import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { SplitText } from './splitText.js'

export default function Hero() {
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

      gsap.from(mediaRef.current, {
        scale: 1.08,
        duration: 1.6,
        ease: 'expo.out',
        delay: 0.2,
      })

      gsap.to(scrollHint.current, {
        y: 10,
        duration: 1.2,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} className="hero">
      <div className="hero__meta mono" data-fade>
        <span>Atulya — Product & Interaction Designer</span>
        <span>Folio / 2026</span>
      </div>

      <h1 className="hero__title display">
        <span className="hero__line" data-split>Designing interfaces</span>
        <span className="hero__line" data-split>
          with clarity, craft,
        </span>
        <span className="hero__line" data-split>
          and a little restraint.
        </span>
      </h1>

      <div className="hero__bottom">
        <div className="hero__media" ref={mediaRef} data-cursor="media" data-cursor-label="Showreel">
          <img
            src="https://images.unsplash.com/photo-1517292987719-0369a794ec0f?w=1600&q=80&auto=format&fit=crop"
            alt=""
          />
          <span className="hero__media-tag mono">REEL · 02:14</span>
          <span className="hero__media-play" aria-hidden>▶</span>
        </div>

        <div className="hero__aside" data-fade>
          <p className="lede">
            Independent designer working between product, brand and
            interaction. Previously at studios you might know, now shipping
            small honest things from Copenhagen.
          </p>
          <div className="hero__ticker mono">
            <span>● Available · Autumn 2026</span>
            <span>● Two slots left</span>
          </div>
        </div>
      </div>

      <div className="hero__scroll mono" ref={scrollHint}>
        <span>Scroll · Selected work</span>
        <svg width="10" height="14" viewBox="0 0 10 14" fill="none">
          <path d="M5 0v13m0 0L1 9m4 4l4-4" stroke="currentColor" />
        </svg>
      </div>
    </section>
  )
}
