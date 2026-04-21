import { useEffect } from 'react'
import { useContent } from '../context/ContentContext.jsx'

// Writes theme tokens from content.theme into :root CSS variables so palette
// edits in the admin panel take effect live.
export default function ThemeBridge() {
  const { content } = useContent()
  const theme = content.theme || {}

  useEffect(() => {
    const root = document.documentElement
    const mode = root.dataset.theme || 'light'
    const metaTheme = document.querySelector('meta[name="theme-color"]')
    const set = (k, v) => {
      if (v) root.style.setProperty(k, v)
    }
    const setFont = (key, value, fallback) => {
      if (!value) return
      root.style.setProperty(key, `"${value}", ${fallback}`)
    }
    const accent =
      !theme.accent || ['#c4653b', '#e28457'].includes(theme.accent.toLowerCase())
        ? '#ff5e1a'
        : theme.accent

    set('--accent', accent)
    setFont('--font-sans', theme.fontDisplay, 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif')
    setFont('--font-display', theme.fontDisplay, 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif')
    setFont('--font-serif', theme.fontSerif, 'Georgia, serif')
    setFont('--font-mono', theme.fontMono, 'ui-monospace, monospace')

    if (mode === 'dark') {
      set('--bg', theme.bgDark)
      set('--bg-alt', theme.bgAltDark)
      set('--fg', theme.fgDark)
      set('--fg-muted', theme.fgMutedDark)
      if (metaTheme && theme.bgDark) metaTheme.setAttribute('content', theme.bgDark)
    } else {
      set('--bg', theme.bgLight)
      set('--bg-alt', theme.bgAltLight)
      set('--fg', theme.fgLight)
      set('--fg-muted', theme.fgMutedLight)
      if (metaTheme && theme.bgLight) metaTheme.setAttribute('content', theme.bgLight)
    }
  }, [
    theme.bgAltDark,
    theme.bgAltLight,
    theme.bgDark,
    theme.bgLight,
    theme.accent,
    theme.fgDark,
    theme.fgLight,
    theme.fgMutedDark,
    theme.fgMutedLight,
    theme.fontDisplay,
    theme.fontMono,
    theme.fontSerif,
  ])

  return null
}
