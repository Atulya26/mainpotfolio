import { useEffect, useMemo, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight, ArrowLeft, ArrowRight } from 'lucide-react'
import { useContent } from '../context/ContentContext.jsx'

gsap.registerPlugin(ScrollTrigger)

// A secondary, scrollable strip of UI work demoted from the hero.
// Type-led head + hairline row of project cards + external CTA.
export default function UIShowcase() {
  const { content } = useContent()
  const hero = content.hero
  const projects = useMemo(() => content.projects.slice(0, 6), [content.projects])
  const hasShowcaseUrl = Boolean(hero.showcaseUrl && hero.showcaseUrl !== '#')
  const sig = projects.map((p) => p.slug).join('|')

  const root = useRef(null)
  const railRef = useRef(null)

  // Reveal on scroll
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.showcase-v__card, .showcase-v__arrow', {
        opacity: 0,
        y: 28,
        duration: 0.9,
        ease: 'expo.out',
        stagger: 0.06,
        scrollTrigger: { trigger: root.current, start: 'top 80%' },
      })
    }, root)
    return () => ctx.revert()
  }, [sig])

  // Drag-to-scroll (same pattern as before)
  useEffect(() => {
    const rail = railRef.current
    if (!rail) return

    let isDown = false
    let startX = 0
    let startScroll = 0
    let moved = false

    const onDown = (e) => {
      if (e.button && e.button !== 0) return
      if (e.target.closest('a, button')) return
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

  const nudge = (dir) => {
    const rail = railRef.current
    if (!rail) return
    const first = rail.querySelector('.showcase-v__card, .showcase-v__arrow')
    const step = first ? first.getBoundingClientRect().width + 20 : rail.clientWidth * 0.8
    rail.scrollBy({ left: dir * step, behavior: 'smooth' })
  }

  const onRailKey = (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); nudge(1) }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); nudge(-1) }
  }

  return (
    <section ref={root} className="showcase-v">
      <div className="showcase-v__head">
        <div>
          <p className="eyebrow">{hero.showcaseEyebrow || 'UI showcase'}</p>
          <p className="showcase-v__copy">
            {hero.showcaseIntro ||
              'A scrollable slice of interface studies, systems work, and product screens.'}
          </p>
        </div>
        <div className="showcase-v__nav">
          <button type="button" className="showcase-v__nav-btn" onClick={() => nudge(-1)} aria-label="Previous" data-cursor="button">
            <ArrowLeft className="showcase-v__nav-icon" />
          </button>
          <button type="button" className="showcase-v__nav-btn" onClick={() => nudge(1)} aria-label="Next" data-cursor="button">
            <ArrowRight className="showcase-v__nav-icon" />
          </button>
        </div>
      </div>

      <div
        className="showcase-v__rail"
        ref={railRef}
        role="region"
        aria-label="UI showcase"
        tabIndex={0}
        onKeyDown={onRailKey}
      >
        {projects.map((project, i) => (
          <article key={project.slug} className="showcase-v__card">
            <div className="showcase-v__top mono">
              <span>{String(i + 1).padStart(2, '0')}</span>
              <span>{project.year}</span>
            </div>
            <div className="showcase-v__image" style={{ background: project.color }}>
              <img src={project.cover} alt={project.client} draggable={false} />
              <span className="showcase-v__pill mono" style={{ color: project.textOnColor }}>
                {project.discipline}
              </span>
            </div>
            <h3 className="showcase-v__title">
              <span>{project.client}</span>
              <span className="showcase-v__sep">—</span>
              <span className="showcase-v__headline">{project.title}</span>
            </h3>
          </article>
        ))}

        {hasShowcaseUrl ? (
          <a
            href={hero.showcaseUrl}
            target="_blank"
            rel="noreferrer"
            className="showcase-v__arrow"
            data-cursor="link"
            data-cursor-label="Open showcase"
          >
            <div className="showcase-v__top mono">
              <span>→</span>
              <span>External</span>
            </div>
            <span className="showcase-v__arrow-label">
              {hero.showcaseCtaLabel || 'Full external showcase'}
            </span>
            <ArrowUpRight className="showcase-v__arrow-icon" />
          </a>
        ) : (
          <div className="showcase-v__arrow showcase-v__arrow--placeholder">
            <div className="showcase-v__top mono">
              <span>→</span>
              <span>External</span>
            </div>
            <span className="showcase-v__arrow-label">
              {hero.showcaseCtaLabel || 'Full external showcase'}
            </span>
            <ArrowUpRight className="showcase-v__arrow-icon" />
          </div>
        )}
      </div>
    </section>
  )
}
