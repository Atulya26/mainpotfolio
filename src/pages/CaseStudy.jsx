import { useEffect, useMemo, useRef } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from '../sections/splitText.js'
import Footer from '../components/Footer.jsx'
import { BlockRenderer } from '../components/CaseStudyBlocks.jsx'
import { useContent } from '../context/ContentContext.jsx'
import { migrateProjectToBlocks } from '../lib/blocks.js'

gsap.registerPlugin(ScrollTrigger)

export default function CaseStudy() {
  const { slug } = useParams()
  const { content } = useContent()
  const projects = content.projects
  const project = projects.find((p) => p.slug === slug)
  const root = useRef(null)
  const blocksRoot = useRef(null)

  const blocks = useMemo(() => {
    if (!project) return []
    return project.blocks?.length ? project.blocks : migrateProjectToBlocks(project)
  }, [project])

  // Intro animations — mount-only, never need re-measure.
  useEffect(() => {
    if (!project) return
    const ctx = gsap.context(() => {
      const intro = root.current.querySelectorAll('[data-split-scroll]')
      intro.forEach((l) => {
        const split = new SplitText(l)
        gsap.from(split.words, {
          yPercent: 110,
          duration: 0.9,
          ease: 'expo.out',
          stagger: 0.03,
          scrollTrigger: { trigger: l, start: 'top 85%' },
        })
      })
      gsap.from('.cs__hero-img', { scale: 1.15, duration: 1.6, ease: 'expo.out', delay: 0.2 })
    }, root)
    return () => ctx.revert()
  }, [project?.slug])

  // ---- Refresh strategy ---------------------------------------------
  //
  // Two carefully-scoped one-shot refreshes:
  //   (a) when the blocks array structure actually changes (id list or count)
  //   (b) when images inside the blocks area finish loading
  //
  // NO ResizeObserver — during a pin, GSAP constantly adjusts the layout,
  // and a RO would re-refresh continuously, killing and rebuilding the pin
  // state in an infinite loop.

  // (a) Blocks structure changed → one rAF → one refresh.
  const blockSig = useMemo(() => blocks.map((b) => b.id).join('|'), [blocks])
  useEffect(() => {
    const id = requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => cancelAnimationFrame(id)
  }, [blockSig])

  // (b) Images inside the blocks area load → refresh once per image.
  useEffect(() => {
    if (!blocksRoot.current) return
    const imgs = Array.from(blocksRoot.current.querySelectorAll('img'))
    const handlers = []
    imgs.forEach((img) => {
      if (!img.complete) {
        const fn = () => ScrollTrigger.refresh()
        img.addEventListener('load', fn, { once: true })
        handlers.push([img, fn])
      }
    })
    return () => handlers.forEach(([img, fn]) => img.removeEventListener('load', fn))
  }, [blockSig])

  if (!project) return <Navigate to="/" replace />

  const idx = projects.findIndex((p) => p.slug === slug)
  const next = projects[(idx + 1) % projects.length]

  return (
    <article ref={root} className="cs">
      <section className="cs__intro shell">
        <div className="cs__intro-meta mono">
          <span>{project.index} / Case Study</span>
          <span>{project.year}</span>
        </div>
        <h1 className="display cs__intro-title" data-split-scroll>{project.title}.</h1>
        <div className="cs__intro-info">
          <div><span className="mono">Client</span><p>{project.client}</p></div>
          <div><span className="mono">Discipline</span><p>{project.category}</p></div>
          <div><span className="mono">Role</span><p>{project.role.join(', ')}</p></div>
          <div><span className="mono">Year</span><p>{project.year}</p></div>
        </div>
      </section>

      <section className="cs__hero" style={{ background: project.color }}>
        <img className="cs__hero-img" src={project.cover} alt="" />
      </section>

      <div ref={blocksRoot} className="cs__blocks">
        {blocks.map((b) => (
          <BlockRenderer key={b.id} block={b} />
        ))}
      </div>

      {next && (
        <Link to={`/work/${next.slug}`} className="cs__next" data-cursor="case" data-cursor-label="Next case">
          <div className="cs__next-inner" style={{ background: next.color, color: next.textOnColor }}>
            <span className="mono">Next — {next.index}</span>
            <h3 className="display">{next.client}</h3>
            <span className="mono">{next.title} ↗</span>
          </div>
        </Link>
      )}

      <Footer />
    </article>
  )
}
