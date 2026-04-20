import { useEffect, useRef } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from '../sections/splitText.js'
import Footer from '../components/Footer.jsx'
import { useContent } from '../context/ContentContext.jsx'

gsap.registerPlugin(ScrollTrigger)

export default function CaseStudy() {
  const { slug } = useParams()
  const { content } = useContent()
  const projects = content.projects
  const project = projects.find((p) => p.slug === slug)
  const root = useRef(null)

  useEffect(() => {
    if (!project) return
    const ctx = gsap.context(() => {
      const lines = root.current.querySelectorAll('[data-split-scroll]')
      lines.forEach((l) => {
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

      const parImgs = root.current.querySelectorAll('.cs__parallax img')
      parImgs.forEach((img) => {
        gsap.fromTo(
          img,
          { yPercent: -8 },
          {
            yPercent: 8,
            ease: 'none',
            scrollTrigger: {
              trigger: img.parentElement,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          },
        )
      })

      const horiz = root.current.querySelector('.cs__horiz')
      if (horiz) {
        const track = horiz.querySelector('.cs__horiz-track')
        const dist = () => track.scrollWidth - window.innerWidth
        gsap.to(track, {
          x: () => -dist(),
          ease: 'none',
          scrollTrigger: {
            trigger: horiz,
            start: 'top top',
            end: () => `+=${dist()}`,
            scrub: 0.6,
            pin: true,
            invalidateOnRefresh: true,
          },
        })
      }
    }, root)
    return () => ctx.revert()
  }, [project?.slug])

  if (!project) return <Navigate to="/" replace />

  const idx = projects.findIndex((p) => p.slug === slug)
  const next = projects[(idx + 1) % projects.length]
  const gallery = project.gallery || []
  const captions = project.galleryCaptions || []

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

      <section className="cs__context shell">
        <div><span className="mono">Context</span></div>
        <div>
          <p className="h2" data-split-scroll>{project.summary}</p>
          <p className="lede" data-split-scroll>{project.contextLede}</p>
        </div>
      </section>

      {gallery[0] && (
        <section className="cs__parallax">
          <img src={gallery[0]} alt="" />
        </section>
      )}

      {(gallery[1] || gallery[2]) && (
        <section className="cs__pair shell">
          {gallery[1] && (
            <figure>
              <img src={gallery[1]} alt="" />
              <figcaption className="mono">{captions[0] || ''}</figcaption>
            </figure>
          )}
          {gallery[2] && (
            <figure>
              <img src={gallery[2]} alt="" />
              <figcaption className="mono">{captions[1] || ''}</figcaption>
            </figure>
          )}
        </section>
      )}

      <section className="cs__quote shell">
        <blockquote data-split-scroll>{`"${project.quote.text}"`}</blockquote>
        <cite className="mono">{project.quote.author}</cite>
      </section>

      <section className="cs__horiz">
        <div className="cs__horiz-track">
          <div className="cs__horiz-head">
            <span className="mono">Process</span>
            <h3 className="h2">Four moves we made.</h3>
          </div>
          {project.process.map((m, i) => (
            <div key={i} className="cs__horiz-card">
              <span className="mono">{String(i + 1).padStart(2, '0')}</span>
              <h4 className="h2">{m.k}</h4>
              <p>{m.v}</p>
            </div>
          ))}
        </div>
      </section>

      {gallery[3] && (
        <section className="cs__full">
          <img src={gallery[3]} alt="" />
        </section>
      )}

      <section className="cs__close shell">
        <div><span className="mono">Outcomes</span></div>
        <div>
          <p className="lede" data-split-scroll>{project.outcomes}</p>
        </div>
      </section>

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
