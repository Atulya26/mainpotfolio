import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useContent } from '../context/ContentContext.jsx'

export default function Preloader({ onDone }) {
  const { content } = useContent()
  const words = content.preloader.words.length ? content.preloader.words : ['Loading']
  const root = useRef(null)
  const counter = useRef(null)
  const wordRef = useRef(null)
  const [mounted, setMounted] = useState(true)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const obj = { n: 0 }
      const tl = gsap.timeline({
        onComplete: () => {
          gsap.to(root.current, {
            yPercent: -100,
            duration: 1.1,
            ease: 'expo.inOut',
            onComplete: () => {
              setMounted(false)
              onDone?.()
            },
          })
        },
      })
      tl.to(obj, {
        n: 100,
        duration: 2.2,
        ease: 'power2.inOut',
        onUpdate: () => {
          if (counter.current) counter.current.textContent = String(Math.round(obj.n)).padStart(3, '0')
        },
      })
      words.forEach((w, i) => {
        tl.to(wordRef.current, { yPercent: -100, duration: 0.35, ease: 'expo.in' }, i * 0.38 + 0.1)
          .set(wordRef.current, { textContent: words[(i + 1) % words.length], yPercent: 100 })
          .to(wordRef.current, { yPercent: 0, duration: 0.35, ease: 'expo.out' })
      })
    }, root)
    return () => ctx.revert()
  }, [])

  if (!mounted) return null

  return (
    <div ref={root} className="preloader" aria-hidden>
      <div className="preloader__rail">
        <span className="mono">Loading</span>
        <span ref={counter} className="preloader__count">000</span>
      </div>
      <div className="preloader__center">
        <div className="preloader__words">
          <span ref={wordRef}>{words[0]}</span>
        </div>
      </div>
      <div className="preloader__foot mono">
        <span>{content.site.name} · Portfolio</span>
        <span>2026 —</span>
      </div>
    </div>
  )
}
