// IntersectionObserver-based reveal primitives.
//
// Why not GSAP ScrollTrigger here?
// -  ScrollTrigger caches start/end positions on mount. When the page content
//    changes (admin adds/removes/reorders blocks), those positions stale and
//    elements either never animate in or animate at the wrong time.
// -  `gsap.from()` sets an initial state immediately; if the trigger point was
//    already scrolled past, the element is stuck invisible forever.
// -  IntersectionObserver only cares about the current viewport. A stale cache
//    is impossible — it recomputes on every scroll and on every layout change.
//
// We keep GSAP for *scrub-driven* effects (parallax, pinned horizontal scroll)
// where it's unmatched. Everything else (fade-up, split-text reveal) moves to
// these hooks.

import { useEffect, useRef } from 'react'

const DEFAULTS = { threshold: 0.15, rootMargin: '0px 0px -10% 0px', once: true }

function observe(el, { threshold, rootMargin, once, onEnter }) {
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          onEnter(entry.target)
          if (once) io.unobserve(entry.target)
        } else if (!once) {
          entry.target.classList.remove('rv-in')
        }
      }
    },
    { threshold, rootMargin },
  )
  io.observe(el)
  return () => io.disconnect()
}

/**
 * Returns a ref. When attached to an element, the element gets class `rv`
 * (initial hidden + transform state). When the element first enters view, it
 * gains `rv-in` and CSS transitions it to its natural state.
 */
export function useReveal(options) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.classList.add('rv')
    return observe(el, {
      ...DEFAULTS,
      ...options,
      onEnter: (target) => target.classList.add('rv-in'),
    })
  }, [])
  return ref
}

/**
 * Splits an element's text into word-by-word masked spans, and reveals them on
 * intersection with a stagger. Idempotent if the element's text doesn't change
 * between renders (we don't re-split if the structure already looks split).
 */
export function useSplitReveal({ stagger = 0.04, ...options } = {}) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Only split once — if we've already run, skip so re-renders don't re-wrap
    // spans inside spans.
    if (!el.dataset.splitDone) {
      const text = el.textContent
      el.textContent = ''
      const parts = text.split(/(\s+)/)
      parts.forEach((chunk) => {
        if (!chunk) return
        if (/^\s+$/.test(chunk)) {
          el.appendChild(document.createTextNode(chunk))
          return
        }
        const mask = document.createElement('span')
        mask.className = 'rv-split-mask'
        const inner = document.createElement('span')
        inner.className = 'rv-split-inner'
        inner.textContent = chunk
        mask.appendChild(inner)
        el.appendChild(mask)
      })
      el.dataset.splitDone = '1'
    }

    // Set stagger via inline transition-delay on each word.
    const inners = el.querySelectorAll('.rv-split-inner')
    inners.forEach((w, i) => {
      w.style.transitionDelay = `${i * stagger}s`
    })

    el.classList.add('rv-split')
    return observe(el, {
      ...DEFAULTS,
      ...options,
      onEnter: (target) => target.classList.add('rv-in'),
    })
  }, [stagger])
  return ref
}
