import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from '../sections/splitText.js'

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
    case 'processCards': return <ProcessBlock b={block} />
    case 'callout': return <CalloutBlock b={block} />
    case 'videoEmbed': return <VideoBlock b={block} />
    case 'divider': return <DividerBlock />
    default: return null
  }
}

/* ============================================================
   Reveal helper — fade-up on enter
============================================================ */
function useReveal(ref, { y = 40, delay = 0 } = {}) {
  useEffect(() => {
    if (!ref.current) return
    const ctx = gsap.context(() => {
      gsap.from(ref.current, {
        y,
        opacity: 0,
        duration: 1,
        ease: 'expo.out',
        delay,
        scrollTrigger: { trigger: ref.current, start: 'top 85%' },
      })
    }, ref)
    return () => ctx.revert()
  }, [])
}

function useSplitLines(ref, selector = '[data-split-scroll]') {
  useEffect(() => {
    if (!ref.current) return
    const ctx = gsap.context(() => {
      ref.current.querySelectorAll(selector).forEach((l) => {
        const split = new SplitText(l)
        gsap.from(split.words, {
          yPercent: 110,
          duration: 0.9,
          ease: 'expo.out',
          stagger: 0.03,
          scrollTrigger: { trigger: l, start: 'top 85%' },
        })
      })
    }, ref)
    return () => ctx.revert()
  }, [])
}

/* ============================================================
   Heading
============================================================ */
function HeadingBlock({ b }) {
  const ref = useRef(null)
  useSplitLines(ref)
  const Tag = b.level === 3 ? 'h3' : 'h2'
  const cls = b.style === 'serif' ? 'cs-block cs-heading cs-heading--serif' : 'cs-block cs-heading'
  return (
    <section ref={ref} className="cs-block-wrap shell">
      <Tag className={cls} data-split-scroll>{b.text}</Tag>
    </section>
  )
}

/* ============================================================
   Paragraph
============================================================ */
function ParagraphBlock({ b }) {
  const ref = useRef(null)
  useSplitLines(ref)
  return (
    <section ref={ref} className="cs-block-wrap shell">
      <p className={`cs-block cs-paragraph ${b.variant === 'lede' ? 'cs-paragraph--lede' : ''}`} data-split-scroll>
        {b.text}
      </p>
    </section>
  )
}

/* ============================================================
   Two column — label + body
============================================================ */
function TwoColumnBlock({ b }) {
  const ref = useRef(null)
  useSplitLines(ref)
  const paras = (b.body || '').split(/\n\n+/).filter(Boolean)
  return (
    <section ref={ref} className="cs-block-wrap shell cs-twocol">
      <div><span className="mono">{b.label}</span></div>
      <div className="cs-twocol__body">
        {paras.map((para, i) => (
          <p key={i} className={i === 0 ? 'h2' : 'lede'} data-split-scroll>
            {para}
          </p>
        ))}
      </div>
    </section>
  )
}

/* ============================================================
   Pull quote
============================================================ */
function PullQuoteBlock({ b }) {
  const ref = useRef(null)
  useSplitLines(ref)
  return (
    <section ref={ref} className="cs-block-wrap shell cs-quote">
      <blockquote data-split-scroll>{`"${b.text}"`}</blockquote>
      {b.author && <cite className="mono">{b.author}</cite>}
    </section>
  )
}

/* ============================================================
   Image — full-bleed or inset, with parallax
============================================================ */
function ImageBlock({ b }) {
  const ref = useRef(null)
  useEffect(() => {
    if (!ref.current) return
    const ctx = gsap.context(() => {
      const img = ref.current.querySelector('img')
      if (!img) return
      gsap.fromTo(
        img,
        { yPercent: -6, scale: 1.05 },
        {
          yPercent: 6,
          scale: 1.05,
          ease: 'none',
          scrollTrigger: {
            trigger: ref.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        },
      )
    }, ref)
    return () => ctx.revert()
  }, [])

  if (!b.src) return null
  const isFull = b.layout === 'full'
  return (
    <section
      ref={ref}
      className={`cs-block-wrap cs-image ${isFull ? 'cs-image--full' : 'cs-image--inset shell'}`}
    >
      <div className="cs-image__frame">
        <img src={b.src} alt={b.alt || ''} />
      </div>
      {b.caption && <figcaption className="mono cs-image__caption">{b.caption}</figcaption>}
    </section>
  )
}

/* ============================================================
   Image pair
============================================================ */
function ImagePairBlock({ b }) {
  const ref = useRef(null)
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

/* ============================================================
   Gallery — grid of N
============================================================ */
function GalleryBlock({ b }) {
  const ref = useRef(null)
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
   Stats
============================================================ */
function StatsBlock({ b }) {
  const ref = useRef(null)
  useEffect(() => {
    if (!ref.current) return
    const ctx = gsap.context(() => {
      gsap.from(ref.current.querySelectorAll('.cs-stat'), {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: 'expo.out',
        stagger: 0.08,
        scrollTrigger: { trigger: ref.current, start: 'top 80%' },
      })
    }, ref)
    return () => ctx.revert()
  }, [])
  return (
    <section ref={ref} className="cs-block-wrap shell cs-stats">
      {(b.items || []).map((s, i) => (
        <div key={i} className="cs-stat">
          <p className="display cs-stat__value">{s.v}</p>
          <p className="mono cs-stat__label">{s.l}</p>
        </div>
      ))}
    </section>
  )
}

/* ============================================================
   Process cards — pinned horizontal scroll
============================================================ */
function ProcessBlock({ b }) {
  const ref = useRef(null)
  useEffect(() => {
    if (!ref.current) return
    const ctx = gsap.context(() => {
      const track = ref.current.querySelector('.cs__horiz-track')
      if (!track) return
      const dist = () => track.scrollWidth - window.innerWidth
      gsap.to(track, {
        x: () => -dist(),
        ease: 'none',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top top',
          end: () => `+=${dist()}`,
          scrub: 0.6,
          pin: true,
          invalidateOnRefresh: true,
        },
      })
    }, ref)
    return () => ctx.revert()
  }, [b.cards?.length])
  return (
    <section ref={ref} className="cs__horiz">
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

/* ============================================================
   Callout
============================================================ */
function CalloutBlock({ b }) {
  const ref = useRef(null)
  useReveal(ref)
  return (
    <section className="cs-block-wrap shell">
      <div ref={ref} className="cs-callout">
        <p className="mono cs-callout__tag">{b.title}</p>
        <p className="cs-callout__body">{b.body}</p>
      </div>
    </section>
  )
}

/* ============================================================
   Video
============================================================ */
function VideoBlock({ b }) {
  const ref = useRef(null)
  useReveal(ref)
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

/* ============================================================
   Divider
============================================================ */
function DividerBlock() {
  return (
    <section className="cs-block-wrap shell">
      <hr className="cs-divider" />
    </section>
  )
}
