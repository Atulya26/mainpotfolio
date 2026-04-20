import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import Footer from '../components/Footer.jsx'
import { useContent } from '../context/ContentContext.jsx'

export default function Archive() {
  const { content } = useContent()
  const arc = content.archive
  const root = useRef(null)
  const [hover, setHover] = useState(null)
  const previewRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.arc__row', {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: 'expo.out',
        stagger: 0.03,
        delay: 0.4,
      })
    }, root)
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    const onMove = (e) => {
      if (!previewRef.current) return
      previewRef.current.style.setProperty('--x', `${e.clientX}px`)
      previewRef.current.style.setProperty('--y', `${e.clientY}px`)
    }
    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  const fullList = [
    ...content.projects.map((p) => ({
      y: p.year,
      t: `${p.client} — ${p.title}`,
      c: p.category,
      img: p.cover,
    })),
    ...arc.rows,
  ]

  return (
    <div ref={root} className="arc shell">
      <header className="arc__head">
        <span className="mono">{arc.eyebrow}</span>
        <h1 className="h2" style={{ whiteSpace: 'pre-line' }}>{arc.heading}</h1>
        <p className="lede">{arc.sub}</p>
      </header>

      <div className="arc__table mono">
        <div className="arc__row arc__row--head">
          <span>Year</span>
          <span>Project</span>
          <span>Discipline</span>
          <span>Status</span>
        </div>
        {fullList.map((r, i) => (
          <div
            key={i}
            className="arc__row"
            onMouseEnter={() => setHover(r.img || null)}
            onMouseLeave={() => setHover(null)}
            data-cursor="link"
          >
            <span>{r.y}</span>
            <span>{r.t}</span>
            <span>{r.c}</span>
            <span>— shipped</span>
          </div>
        ))}
      </div>

      <div ref={previewRef} className={`arc__preview ${hover ? 'is-on' : ''}`}>
        {hover && <img src={hover} alt="" />}
      </div>

      <Footer />
    </div>
  )
}
