import { AnimatePresence, motion } from 'framer-motion'
import { useLocation, useOutlet } from 'react-router-dom'
import { useEffect } from 'react'
import { getLenis } from '../lib/useLenis.js'

// Barba-style cover transition: a solid panel slides in from the bottom,
// covers the viewport, the new route mounts underneath, then the panel
// slides out the top. On every route change, Lenis is scrolled to the top.
export default function PageTransition() {
  const location = useLocation()
  const outlet = useOutlet()

  useEffect(() => {
    const lenis = getLenis()
    if (lenis) lenis.scrollTo(0, { immediate: true })
    else window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <>
      <AnimatePresence mode="wait" initial={false}>
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.35, ease: [0.22, 1, 0.36, 1] } }}
          exit={{ opacity: 0, transition: { duration: 0.25, ease: [0.65, 0.05, 0.36, 1] } }}
        >
          {outlet}
        </motion.main>
      </AnimatePresence>

      <AnimatePresence>
        <motion.div
          key={`cover-${location.pathname}`}
          className="page-cover"
          initial={{ scaleY: 0, transformOrigin: 'bottom' }}
          animate={{
            scaleY: [0, 1, 1, 0],
            transformOrigin: ['bottom', 'bottom', 'top', 'top'],
            transition: {
              duration: 1.2,
              times: [0, 0.45, 0.55, 1],
              ease: [0.76, 0, 0.24, 1],
            },
          }}
        >
          <span className="page-cover__label mono">
            <span>Atulya</span>
            <span>/ {location.pathname === '/' ? 'selected' : location.pathname.slice(1)}</span>
          </span>
        </motion.div>
      </AnimatePresence>
    </>
  )
}
