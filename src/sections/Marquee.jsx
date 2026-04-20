import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useContent } from '../context/ContentContext.jsx'

gsap.registerPlugin(ScrollTrigger)

export default function Marquee() {
  const { content } = useContent()
  const words = content.marquee.words
  const track = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const el = track.current
      gsap.to(el, { xPercent: -50, repeat: -1, duration: 40, ease: 'none' })
      ScrollTrigger.create({
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          gsap.to(el, { skewX: self.getVelocity() / -400, duration: 0.4, overwrite: 'auto' })
        },
      })
    })
    return () => ctx.revert()
  }, [words.join('|')])

  return (
    <div className="marquee" aria-hidden>
      <div className="marquee__track" ref={track}>
        {Array.from({ length: 4 }).map((_, i) => (
          <span className="marquee__row display" key={i}>
            {words.map((w, j) => (
              <span key={j} className={j % 2 ? 'serif' : ''}>
                {w} <i className="marquee__dot" />
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  )
}
