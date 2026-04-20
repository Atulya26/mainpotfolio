import { useEffect, useRef } from 'react'

// Playful trail cursor — a solid dot chasing a hollow ring.
// Idles to a soft pulse when the pointer is still.
export default function Cursor() {
  const ringRef = useRef(null)
  const dotRef = useRef(null)
  const labelRef = useRef(null)
  const state = useRef({
    x: -100, y: -100,
    rx: -100, ry: -100,
    dx: -100, dy: -100,
    idle: 0,
    hovering: null,
  })

  useEffect(() => {
    if (window.matchMedia('(hover: none)').matches) return

    const s = state.current
    const onMove = (e) => {
      s.x = e.clientX
      s.y = e.clientY
      s.idle = 0
      document.body.classList.remove('cursor-idle')
    }
    const onDown = () => document.body.classList.add('cursor-down')
    const onUp = () => document.body.classList.remove('cursor-down')
    const onOver = (e) => {
      const target = e.target.closest('[data-cursor]')
      if (target) {
        s.hovering = target.dataset.cursor
        document.body.classList.add('cursor-hover')
        document.body.dataset.cursorMode = target.dataset.cursor
        if (labelRef.current) {
          labelRef.current.textContent = target.dataset.cursorLabel || ''
          labelRef.current.style.opacity = target.dataset.cursorLabel ? '1' : '0'
        }
      } else {
        s.hovering = null
        document.body.classList.remove('cursor-hover')
        delete document.body.dataset.cursorMode
        if (labelRef.current) {
          labelRef.current.style.opacity = '0'
        }
      }
    }

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointerover', onOver)

    let rafId
    const tick = () => {
      // Ring: softer lag
      s.rx += (s.x - s.rx) * 0.16
      s.ry += (s.y - s.ry) * 0.16
      // Dot: snappier
      s.dx += (s.x - s.dx) * 0.35
      s.dy += (s.y - s.dy) * 0.35

      s.idle += 1
      if (s.idle > 140) document.body.classList.add('cursor-idle')

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${s.rx}px, ${s.ry}px, 0) translate(-50%, -50%)`
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${s.dx}px, ${s.dy}px, 0) translate(-50%, -50%)`
      }
      if (labelRef.current) {
        labelRef.current.style.transform = `translate3d(${s.rx}px, ${s.ry + 28}px, 0) translate(-50%, 0)`
      }
      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointerover', onOver)
    }
  }, [])

  return (
    <>
      <div ref={ringRef} className="cursor-ring" aria-hidden />
      <div ref={dotRef} className="cursor-dot" aria-hidden />
      <div ref={labelRef} className="cursor-label" aria-hidden />
    </>
  )
}
