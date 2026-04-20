import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Footer() {
  const root = useRef(null)
  const big = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        big.current,
        { yPercent: 30, scale: 0.98 },
        {
          yPercent: 0,
          scale: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            start: 'top bottom',
            end: 'bottom bottom',
            scrub: true,
          },
        },
      )
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <footer ref={root} className="footer">
      <div className="footer__top">
        <p className="eyebrow">Let's talk</p>
        <p className="footer__lead lede">
          Currently taking on two new projects for autumn — interaction-led
          product work, thoughtful brand systems, and long-form case studies.
        </p>
      </div>

      <a
        ref={big}
        className="footer__big display"
        href="mailto:hi@atulya.studio"
        data-cursor="link"
        data-cursor-label="Write a note"
      >
        <span>Say</span>
        <span className="serif">hello</span>
        <span>↗</span>
      </a>

      <div className="footer__grid">
        <div>
          <p className="eyebrow">Based</p>
          <p>Copenhagen, DK ↔ remote</p>
        </div>
        <div>
          <p className="eyebrow">Contact</p>
          <a href="mailto:hi@atulya.studio" data-cursor="link">hi@atulya.studio</a>
          <a href="#" data-cursor="link">+45 00 00 00 00</a>
        </div>
        <div>
          <p className="eyebrow">Follow</p>
          <a href="#" data-cursor="link">LinkedIn ↗</a>
          <a href="#" data-cursor="link">Read.cv ↗</a>
          <a href="#" data-cursor="link">Are.na ↗</a>
        </div>
        <div>
          <p className="eyebrow">Colophon</p>
          <p>Built with React, GSAP, Lenis. Type in Inter Tight & Instrument Serif.</p>
        </div>
      </div>

      <div className="footer__bar mono">
        <span>© 2026 Atulya</span>
        <span>All projects, unless noted, © their respective owners.</span>
        <span>v. 0.1</span>
      </div>
    </footer>
  )
}
