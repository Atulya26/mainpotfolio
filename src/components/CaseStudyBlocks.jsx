import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReveal, useSplitReveal } from '../lib/reveal.js'

gsap.registerPlugin(ScrollTrigger)

/* ============================================================
   Block router — pick a renderer per type.
============================================================ */
export function BlockRenderer({ block }) {
  switch (block.type) {
    case 'heading': return <HeadingBlock b={block} />
    case 'paragraph': return <ParagraphBlock b={block} />
    case 'twoColumn': return <TwoColumnBlock b={block} />
    case 'pullQuote': return <PullQuoteBlock b={block} />
    case 'image': return <ImageBlock b={block} />
    case 'imagePair': return <ImagePairBlock b={block} />
    case 'imageGallery': return <GalleryBlock b={block} />
    case 'stats': return <StatsBlock b={block} />
    case 'factGrid': return <FactGridBlock b={block} />
    case 'bulletList': return <BulletListBlock b={block} />
    case 'timeline': return <TimelineBlock b={block} />
    case 'processCards': return <ProcessBlock b={block} />
    case 'callout': return <CalloutBlock b={block} />
    case 'videoEmbed': return <VideoBlock b={block} />
    case 'divider': return <DividerBlock />
    default: return null
  }
}

/* ============================================================
   Reveal-based blocks (IntersectionObserver + CSS)
   These are idempotent — adding/removing blocks around them can't
   break their animation because they don't cache scroll positions.
============================================================ */

function HeadingBlock({ b }) {
  const ref = useSplitReveal()
  const Tag = b.level === 3 ? 'h3' : 'h2'
  const cls = b.style === 'serif' ? 'cs-block cs-heading cs-heading--serif' : 'cs-block cs-heading'
  return (
    <section className="cs-block-wrap shell">
      <Tag ref={ref} className={cls}>{b.text}</Tag>
    </section>
  )
}

function ParagraphBlock({ b }) {
  const ref = useSplitReveal({ stagger: 0.02 })
  return (
    <section className="cs-block-wrap shell">
      <p ref={ref} className={`cs-block cs-paragraph ${b.variant === 'lede' ? 'cs-paragraph--lede' : ''}`}>
        {b.text}
      </p>
    </section>
  )
}

function TwoColumnBlock({ b }) {
  const labelRef = useReveal()
  const bodyRef = useReveal()
  const paras = (b.body || '').split(/\n\n+/).filter(Boolean)
  return (
    <section className="cs-block-wrap shell cs-twocol">
      <div ref={labelRef}><span className="mono">{b.label}</span></div>
      <div ref={bodyRef} className="cs-twocol__body">
        {paras.map((para, i) => (
          <p key={i} className={i === 0 ? 'h2' : 'lede'}>{para}</p>
        ))}
      </div>
    </section>
  )
}

function PullQuoteBlock({ b }) {
  const ref = useSplitReveal({ stagger: 0.025 })
  const citeRef = useReveal()
  return (
    <section className="cs-block-wrap shell cs-quote">
      <blockquote ref={ref}>{`"${b.text}"`}</blockquote>
      {b.author && <cite ref={citeRef} className="mono">{b.author}</cite>}
    </section>
  )
}

function CalloutBlock({ b }) {
  const ref = useReveal()
  return (
    <section className="cs-block-wrap shell">
      <div ref={ref} className="cs-callout">
        <p className="mono cs-callout__tag">{b.title}</p>
        <p className="cs-callout__body">{b.body}</p>
      </div>
    </section>
  )
}

function StatsBlock({ b }) {
  return (
    <section className="cs-block-wrap shell cs-stats">
      {(b.items || []).map((s, i) => (
        <Stat key={i} index={i} value={s.v} label={s.l} />
      ))}
    </section>
  )
}

function FactGridBlock({ b }) {
  const ref = useReveal()
  const items = (b.items || []).filter((item) => item.label || item.value)
  if (!items.length) return null

  return (
    <section ref={ref} className="cs-block-wrap shell cs-facts">
      {b.eyebrow && <span className="mono cs-facts__eyebrow">{b.eyebrow}</span>}
      <div className="cs-facts__grid">
        {items.map((item, i) => (
          <div key={i} className="cs-fact">
            <span className="mono">{item.label}</span>
            <p>{item.value}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function BulletListBlock({ b }) {
  const ref = useReveal()
  const items = (b.items || []).filter(Boolean)
  if (!items.length) return null

  return (
    <section ref={ref} className="cs-block-wrap shell cs-list">
      <div className="cs-list__head">
        {b.eyebrow && <span className="mono">{b.eyebrow}</span>}
        {b.heading && <h3 className="cs-list__heading">{b.heading}</h3>}
      </div>
      <ul className="cs-list__items">
        {items.map((item, i) => (
          <li key={i} className="cs-list__item">
            <span className="mono cs-list__index">{String(i + 1).padStart(2, '0')}</span>
            <p>{item}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}

function TimelineBlock({ b }) {
  const ref = useReveal()
  const items = (b.items || []).filter((item) => item.k || item.v)
  if (!items.length) return null

  return (
    <section ref={ref} className="cs-block-wrap shell cs-timeline">
      {b.eyebrow && <span className="mono cs-timeline__eyebrow">{b.eyebrow}</span>}
      <div className="cs-timeline__rows">
        {items.map((item, i) => (
          <div key={i} className="cs-timeline__row">
            <span className="mono">{item.k}</span>
            <p>{item.v}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function Stat({ value, label, index }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.classList.add('rv')
    el.style.transitionDelay = `${index * 0.08}s`
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('rv-in')
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.25, rootMargin: '0px 0px -10% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [index])
  return (
    <div ref={ref} className="cs-stat">
      <p className="display cs-stat__value">{value}</p>
      <p className="mono cs-stat__label">{label}</p>
    </div>
  )
}

function VideoBlock({ b }) {
  const ref = useReveal()
  if (!b.url) return null
  const isYoutube = /youtube\.com|youtu\.be/.test(b.url)
  const isVimeo = /vimeo\.com/.test(b.url)
  const isFile = /\.(mp4|webm|mov)(\?|$)/i.test(b.url)
  let embedSrc = b.url
  if (isYoutube) {
    const id = b.url.match(/(?:v=|youtu\.be\/|embed\/)([\w-]{11})/)?.[1]
    if (id) embedSrc = `https://www.youtube.com/embed/${id}`
  } else if (isVimeo) {
    const id = b.url.match(/vimeo\.com\/(\d+)/)?.[1]
    if (id) embedSrc = `https://player.vimeo.com/video/${id}`
  }
  return (
    <section ref={ref} className="cs-block-wrap shell cs-video">
      <div className="cs-video__frame">
        {isFile ? (
          <video src={b.url} controls playsInline />
        ) : (
          <iframe src={embedSrc} frameBorder="0" allow="autoplay; fullscreen" allowFullScreen />
        )}
      </div>
      {b.caption && <figcaption className="mono">{b.caption}</figcaption>}
    </section>
  )
}

function DividerBlock() {
  return (
    <section className="cs-block-wrap shell">
      <hr className="cs-divider" />
    </section>
  )
}

/* ============================================================
   Figures — reveal on entry, no scrub
============================================================ */

function ImagePairBlock({ b }) {
  const ref = useReveal()
  return (
    <section ref={ref} className="cs-block-wrap shell cs-pair">
      {[b.left, b.right].map(
        (fig, i) =>
          fig?.src && (
            <figure key={i}>
              <img src={fig.src} alt={fig.alt || ''} />
              {fig.caption && <figcaption className="mono">{fig.caption}</figcaption>}
            </figure>
          ),
      )}
    </section>
  )
}

function GalleryBlock({ b }) {
  const ref = useReveal()
  const items = (b.items || []).filter((x) => x.src)
  if (!items.length) return null
  return (
    <section
      ref={ref}
      className="cs-block-wrap shell cs-gallery"
      style={{ '--cols': b.columns || 3 }}
    >
      {items.map((it, i) => (
        <figure key={i}>
          <img src={it.src} alt={it.alt || ''} />
          {it.caption && <figcaption className="mono">{it.caption}</figcaption>}
        </figure>
      ))}
    </section>
  )
}

/* ============================================================
   Scrub-driven blocks (GSAP ScrollTrigger)
   These genuinely need scroll-position sync (parallax translation,
   pinned horizontal scroll). We flag them with `invalidateOnRefresh`
   so a single ScrollTrigger.refresh() at the page level re-measures
   them whenever the layout changes.
============================================================ */

function ImageBlock({ b }) {
  const wrapRef = useRef(null)
  useEffect(() => {
    if (!wrapRef.current) return
    const ctx = gsap.context(() => {
      const img = wrapRef.current.querySelector('img')
      if (!img) return
      gsap.fromTo(
        img,
        { yPercent: -6 },
        {
          yPercent: 6,
          ease: 'none',
          scrollTrigger: {
            trigger: wrapRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      )
    }, wrapRef)
    return () => ctx.revert()
  }, [b.src])

  if (!b.src) return null
  const isFull = b.layout === 'full'
  return (
    <section
      ref={wrapRef}
      className={`cs-block-wrap cs-image ${isFull ? 'cs-image--full' : 'cs-image--inset shell'}`}
    >
      <div className="cs-image__frame">
        <img src={b.src} alt={b.alt || ''} />
      </div>
      {b.caption && <figcaption className="mono cs-image__caption">{b.caption}</figcaption>}
    </section>
  )
}

function ProcessBlock({ b }) {
  const wrapRef = useRef(null)
  useEffect(() => {
    if (!wrapRef.current) return
    const ctx = gsap.context(() => {
      const track = wrapRef.current.querySelector('.cs__horiz-track')
      if (!track) return
      const dist = () => track.scrollWidth - window.innerWidth
      gsap.to(track, {
        x: () => -dist(),
        ease: 'none',
        scrollTrigger: {
          trigger: wrapRef.current,
          start: 'top top',
          end: () => `+=${dist()}`,
          scrub: 0.6,
          pin: true,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      })
    }, wrapRef)
    return () => ctx.revert()
  }, [b.cards?.length, b.heading])
  return (
    <section ref={wrapRef} className="cs__horiz">
      <div className="cs__horiz-track">
        <div className="cs__horiz-head">
          <span className="mono">{b.eyebrow}</span>
          <h3 className="h2">{b.heading}</h3>
        </div>
        {(b.cards || []).map((m, i) => (
          <div key={i} className="cs__horiz-card">
            <span className="mono">{String(i + 1).padStart(2, '0')}</span>
            <h4 className="h2">{m.k}</h4>
            <p>{m.v}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
