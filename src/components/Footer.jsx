import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useContent } from '../context/ContentContext.jsx'

gsap.registerPlugin(ScrollTrigger)

export default function Footer() {
  const { content } = useContent()
  const f = content.footer
  const site = content.site
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
        <p className="eyebrow">{f.eyebrow}</p>
        <p className="footer__lead lede">{f.lead}</p>
      </div>

      <a
        ref={big}
        className="footer__big display"
        href={`mailto:${site.email}`}
        data-cursor="link"
        data-cursor-label="Write a note"
      >
        <span>{f.bigWord1}</span>
        <span className="serif">{f.bigWord2}</span>
        <span>{f.bigArrow}</span>
      </a>

      <div className="footer__grid">
        <div>
          <p className="eyebrow">{f.basedLabel}</p>
          <p>{f.basedValue}</p>
        </div>
        <div>
          <p className="eyebrow">{f.contactLabel}</p>
          <a href={`mailto:${site.email}`} data-cursor="link">{site.email}</a>
          <a href="#" data-cursor="link">{site.phone}</a>
        </div>
        <div>
          <p className="eyebrow">{f.followLabel}</p>
          {site.socials.map((s) => (
            <a key={s.label} href={s.url} data-cursor="link">{s.label}</a>
          ))}
        </div>
        <div>
          <p className="eyebrow">{f.colophonLabel}</p>
          <p>{site.colophon}</p>
        </div>
      </div>

      <div className="footer__bar mono">
        <span>{site.copyright}</span>
        <span>{site.rights}</span>
        <span>{site.version}</span>
      </div>
    </footer>
  )
}
