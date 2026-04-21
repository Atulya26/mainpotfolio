import { useEffect, useMemo, useRef } from 'react'
import gsap from 'gsap'
import { ArrowUpRight, ArrowLeft, ArrowRight } from 'lucide-react'
import { SplitText } from './splitText.js'
import { useContent } from '../context/ContentContext.jsx'

export default function Hero() {
  const { content } = useContent()
  const hero = content.hero
  const showcaseProjects = useMemo(() => content.projects.slice(0, 6), [content.projects])
  const hasShowcaseUrl = Boolean(hero.showcaseUrl && hero.showcaseUrl !== '#')
  const titleSig = hero.titleLines.join('|')
  const showcaseSig = showcaseProjects.map((project) => project.slug).join('|')

  const root = useRef(null)
  const showcaseRef = useRef(null)
  const railRef = useRef(null)
  const scrollHint = useRef(null)

  // ---- Intro animations (mount-only) ------------------------------
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

      gsap.from(showcaseRef.current?.querySelectorAll('.hero__showcase-card, .hero__showcase-arrow') || [], {
        opacity: 0,
        y: 28,
        duration: 0.9,
        ease: 'expo.out',
        stagger: 0.06,
        delay: 0.95,
      })
      gsap.to(scrollHint.current, { y: 10, duration: 1.2, ease: 'sine.inOut', yoyo: true, repeat: -1 })
    }, root)
    return () => ctx.revert()
  }, [showcaseSig, titleSig])

  // ---- Drag-to-scroll for the rail --------------------------------
  //
  // No `data-lenis-prevent` on the rail: Lenis catches vertical wheel at
  // the window level and scrolls the page. Vertical wheel is never eaten
  // here. Horizontal trackpad / shift+wheel fall through to native scroll.
  // Mouse users get click-drag as an affordance.
  useEffect(() => {
    const rail = railRef.current
    if (!rail) return

    let isDown = false
    let startX = 0
    let startScroll = 0
    let moved = false

    const onDown = (e) => {
      // Ignore right-click / middle
      if (e.button && e.button !== 0) return
      // Don't start a drag on interactive children — they'd lose click.
      const interactive = e.target.closest('a, button')
      if (interactive) return
      isDown = true
      moved = false
      startX = e.clientX
      startScroll = rail.scrollLeft
      rail.setPointerCapture?.(e.pointerId)
      rail.classList.add('is-dragging')
    }
    const onMove = (e) => {
      if (!isDown) return
      const dx = e.clientX - startX
      if (Math.abs(dx) > 4) moved = true
      rail.scrollLeft = startScroll - dx
    }
    const onUp = (e) => {
      if (!isDown) return
      isDown = false
      rail.releasePointerCapture?.(e.pointerId)
      rail.classList.remove('is-dragging')
      // Swallow the click that comes after a real drag, so "ghost clicks"
      // on cards don't navigate when the user just wanted to drag.
      if (moved) {
        const stop = (ev) => ev.stopPropagation()
        rail.addEventListener('click', stop, { capture: true, once: true })
      }
    }

    rail.addEventListener('pointerdown', onDown)
    rail.addEventListener('pointermove', onMove)
    rail.addEventListener('pointerup', onUp)
    rail.addEventListener('pointercancel', onUp)
    return () => {
      rail.removeEventListener('pointerdown', onDown)
      rail.removeEventListener('pointermove', onMove)
      rail.removeEventListener('pointerup', onUp)
      rail.removeEventListener('pointercancel', onUp)
    }
  }, [])

  // ---- Prev / next buttons + keyboard -----------------------------
  const nudge = (dir) => {
    const rail = railRef.current
    if (!rail) return
    const first = rail.querySelector('.hero__showcase-card, .hero__showcase-arrow')
    const step = first ? first.getBoundingClientRect().width + 18 : rail.clientWidth * 0.8
    rail.scrollBy({ left: dir * step, behavior: 'smooth' })
  }

  const onRailKey = (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); nudge(1) }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); nudge(-1) }
  }

  return (
    <section ref={root} className="hero">
      <div className="hero__meta mono" data-fade>
        <span>{hero.metaLeft}</span>
        {hero.metaRight ? <span>{hero.metaRight}</span> : null}
      </div>

      <h1 className="hero__title display">
        {hero.titleLines.map((line, i) => (
          <span className="hero__line" data-split key={i}>
            {line}
          </span>
        ))}
      </h1>

      <div className="hero__bottom" data-fade>
        <div className="hero__showcase" ref={showcaseRef}>
          <div className="hero__showcase-head">
            <div>
              <p className="mono">{hero.showcaseEyebrow || 'UI showcase'}</p>
              <p className="hero__showcase-copy">
                {hero.showcaseIntro || 'A scrollable slice of interface studies, systems work, and product screens.'}
              </p>
            </div>

            <div className="hero__showcase-nav">
              <button
                type="button"
                className="hero__showcase-nav-btn"
                onClick={() => nudge(-1)}
                aria-label="Previous showcase card"
                data-cursor="button"
              >
                <ArrowLeft className="hero__showcase-nav-icon" />
              </button>
              <button
                type="button"
                className="hero__showcase-nav-btn"
                onClick={() => nudge(1)}
                aria-label="Next showcase card"
                data-cursor="button"
              >
                <ArrowRight className="hero__showcase-nav-icon" />
              </button>
            </div>
          </div>

          <div
            className="hero__showcase-rail"
            ref={railRef}
            role="region"
            aria-label="UI showcase"
            tabIndex={0}
            onKeyDown={onRailKey}
          >
            {showcaseProjects.map((project, i) => (
              <article key={project.slug} className="hero__showcase-card">
                <div className="hero__showcase-top mono">
                  <span>{String(i + 1).padStart(2, '0')}</span>
                  <span>{project.year}</span>
                </div>
                <div
                  className="hero__showcase-image"
                  style={{ background: project.color }}
                >
                  <img src={project.cover} alt={project.client} draggable={false} />
                  <span
                    className="hero__showcase-pill mono"
                    style={{ color: project.textOnColor }}
                  >
                    {project.discipline}
                  </span>
                </div>
                <h3 className="hero__showcase-title">
                  <span>{project.client}</span>
                  <span className="hero__showcase-hyphen">—</span>
                  <span className="hero__showcase-headline">{project.title}</span>
                </h3>
              </article>
            ))}

            {hasShowcaseUrl ? (
              <a
                href={hero.showcaseUrl}
                target="_blank"
                rel="noreferrer"
                className="hero__showcase-arrow"
                data-cursor="link"
                data-cursor-label="Open showcase"
              >
                <div className="hero__showcase-top mono">
                  <span>→</span>
                  <span>External</span>
                </div>
                <span className="hero__showcase-arrow-label">
                  {hero.showcaseCtaLabel || 'Full external showcase'}
                </span>
                <ArrowUpRight className="hero__showcase-arrow-icon" />
              </a>
            ) : (
              <div className="hero__showcase-arrow hero__showcase-arrow--placeholder">
                <div className="hero__showcase-top mono">
                  <span>→</span>
                  <span>External</span>
                </div>
                <span className="hero__showcase-arrow-label">
                  {hero.showcaseCtaLabel || 'Full external showcase'}
                </span>
                <ArrowUpRight className="hero__showcase-arrow-icon" />
              </div>
            )}
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
