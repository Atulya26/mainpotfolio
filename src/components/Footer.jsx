import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight } from 'lucide-react'
import { useContent } from '../context/ContentContext.jsx'

gsap.registerPlugin(ScrollTrigger)

export default function Footer() {
  const { content } = useContent()
  const f = content.footer
  const site = content.site
  const hero = content.hero
  const nav = content.nav
  const root = useRef(null)
  const big = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        big.current,
        { yPercent: 20, opacity: 0.6 },
        {
          yPercent: 0,
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            start: 'top bottom',
            end: 'top 20%',
            scrub: true,
          },
        },
      )
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <footer ref={root} className="footer-v">
      {/* Big CTA */}
      <div className="footer-v__cta">
        <p className="eyebrow footer-v__cta-eyebrow">{f.eyebrow}</p>
        <a
          ref={big}
          href={`mailto:${site.email}`}
          className="footer-v__big"
          data-cursor="link"
          data-cursor-label="Write a note"
        >
          <span>Start a project</span>
          <ArrowUpRight className="footer-v__big-icon" />
        </a>
        <p className="footer-v__lead">{f.lead}</p>
      </div>

      {/* Columns */}
      <div className="footer-v__cols">
        <div className="footer-v__col">
          <p className="eyebrow">{f.contactLabel || 'Contact'}</p>
          <a href={`mailto:${site.email}`} data-cursor="link">{site.email}</a>
          <a href={`tel:${site.phone}`} data-cursor="link">{site.phone}</a>
          <span className="footer-v__muted">{site.studio}</span>
        </div>
        <div className="footer-v__col">
          <p className="eyebrow">Navigate</p>
          {nav.menuItems.slice(1).map((m) => (
            <Link key={m.label + m.num} to={m.path} data-cursor="link">
              {m.label}
            </Link>
          ))}
        </div>
        <div className="footer-v__col">
          <p className="eyebrow">{f.followLabel || 'Elsewhere'}</p>
          {site.socials.map((s) => (
            <a key={s.label} href={s.url} data-cursor="link">
              {s.label}
            </a>
          ))}
        </div>
        <div className="footer-v__col footer-v__col--status">
          <p className="eyebrow">Status</p>
          <span className="footer-v__status">
            <span className="footer-v__dot" aria-hidden />
            {hero.availabilityStatus || 'Available for hire'}
          </span>
          <span className="footer-v__muted">{site.availability}</span>
          <span className="footer-v__muted">{site.slotsLeft}</span>
        </div>
      </div>

      {/* Colophon bar */}
      <div className="footer-v__bar mono">
        <span>{site.copyright}</span>
        <span className="footer-v__muted">{site.colophon}</span>
        <span>{site.version}</span>
      </div>
    </footer>
  )
}
