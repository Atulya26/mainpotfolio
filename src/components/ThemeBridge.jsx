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
    const set = (k, v) => {
      if (v) root.style.setProperty(k, v)
    }
    set('--accent', theme.accent)
    if (mode === 'dark') {
      set('--bg', theme.bgDark)
      set('--bg-alt', theme.bgAltDark)
      set('--fg', theme.fgDark)
      set('--fg-muted', theme.fgMutedDark)
    } else {
      set('--bg', theme.bgLight)
      set('--bg-alt', theme.bgAltLight)
      set('--fg', theme.fgLight)
      set('--fg-muted', theme.fgMutedLight)
    }
  })

  return null
}
