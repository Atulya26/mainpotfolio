import { createContext, useContext, useEffect, useMemo, useRef, useState, useCallback } from 'react'

const LS_KEY = 'portfolio:content'
const LS_DIRTY = 'portfolio:dirty'
const CHANNEL = 'portfolio:content-sync'

const ContentContext = createContext(null)

export function useContent() {
  const v = useContext(ContentContext)
  if (!v) throw new Error('useContent must be used inside <ContentProvider />')
  return v
}

// Dot-path getter/setter for arbitrary content updates
function setPath(obj, path, value) {
  const keys = Array.isArray(path) ? path : path.split('.')
  const clone = Array.isArray(obj) ? [...obj] : { ...obj }
  let cur = clone
  for (let i = 0; i < keys.length - 1; i++) {
    const k = keys[i]
    const next = cur[k]
    cur[k] = Array.isArray(next) ? [...next] : { ...next }
    cur = cur[k]
  }
  cur[keys[keys.length - 1]] = value
  return clone
}

function getPath(obj, path) {
  const keys = Array.isArray(path) ? path : path.split('.')
  return keys.reduce((acc, k) => (acc == null ? acc : acc[k]), obj)
}

// Draft wins; defaults only fill gaps for keys the draft doesn't know about.
// Arrays in the draft are used as-is (user's edits shouldn't be merged away).
function deepMergeDefaults(draft, defaults) {
  if (Array.isArray(draft) || Array.isArray(defaults)) return draft ?? defaults
  if (typeof draft !== 'object' || draft === null) return draft
  if (typeof defaults !== 'object' || defaults === null) return draft
  const out = { ...defaults }
  for (const k of Object.keys(draft)) {
    out[k] = deepMergeDefaults(draft[k], defaults[k])
  }
  return out
}

function normalizeThemeAccent(next) {
  const accent = next?.theme?.accent?.toLowerCase?.()
  if (!next?.theme) return next
  if (accent && !['#c4653b', '#e28457'].includes(accent)) return next
  return {
    ...next,
    theme: {
      ...next.theme,
      accent: '#ff5e1a',
    },
  }
}

function normalizeHero(next) {
  if (!next?.hero) return next
  const metaRight = next.hero.metaRight?.trim?.().toLowerCase?.()
  if (metaRight && !['folio / 2026', 'folio/2026'].includes(metaRight)) return next
  return {
    ...next,
    hero: {
      ...next.hero,
      metaRight: '',
    },
  }
}

function normalizeContent(next) {
  return normalizeHero(normalizeThemeAccent(next))
}

export function ContentProvider({ children }) {
  const [content, setContent] = useState(null)
  const [publishedContent, setPublishedContent] = useState(null) // last-known server state
  const [loading, setLoading] = useState(true)
  const [dirty, setDirty] = useState(false)
  const channelRef = useRef(null)

  // Load: try localStorage → fallback to fetch /content.json
  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const res = await fetch('/content.json', { cache: 'no-store' })
        const server = normalizeContent(await res.json())
        const stored = localStorage.getItem(LS_KEY)
        if (cancelled) return
        if (stored) {
          try {
            const parsed = JSON.parse(stored)
            // Merge server defaults under the draft — fills in any new keys
            // added to content.json since the draft was saved.
            const merged = normalizeContent(deepMergeDefaults(parsed, server))
            setContent(merged)
            setDirty(localStorage.getItem(LS_DIRTY) === '1')
          } catch {
            setContent(server)
          }
        } else {
          setContent(server)
        }
        setPublishedContent(server)
      } catch (e) {
        console.error('Content load failed', e)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  // BroadcastChannel so admin edits in one tab update the site tab live
  useEffect(() => {
    if (typeof BroadcastChannel === 'undefined') return
    const ch = new BroadcastChannel(CHANNEL)
    channelRef.current = ch
    ch.onmessage = (e) => {
      if (e.data?.type === 'update' && e.data.content) {
        setContent(e.data.content)
        setDirty(true)
      }
    }
    return () => ch.close()
  }, [])

  const persist = useCallback((next, markDirty = true) => {
    setContent(next)
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(next))
      if (markDirty) {
        localStorage.setItem(LS_DIRTY, '1')
        setDirty(true)
      }
    } catch (e) {
      console.error('Persist failed', e)
    }
    channelRef.current?.postMessage({ type: 'update', content: next })
  }, [])

  const update = useCallback(
    (path, value) => {
      setContent((prev) => {
        const next = setPath(prev, path, value)
        persist(next)
        return next
      })
    },
    [persist],
  )

  const updateMany = useCallback(
    (updates) => {
      setContent((prev) => {
        let next = prev
        for (const [path, value] of updates) next = setPath(next, path, value)
        persist(next)
        return next
      })
    },
    [persist],
  )

  const replaceAll = useCallback(
    (next, markDirty = true) => {
      persist(next, markDirty)
    },
    [persist],
  )

  const resetToPublished = useCallback(() => {
    if (!publishedContent) return
    localStorage.removeItem(LS_KEY)
    localStorage.removeItem(LS_DIRTY)
    setContent(publishedContent)
    setDirty(false)
    channelRef.current?.postMessage({ type: 'update', content: publishedContent })
  }, [publishedContent])

  const markPublished = useCallback((serverContent) => {
    setPublishedContent(serverContent)
    setDirty(false)
    localStorage.setItem(LS_KEY, JSON.stringify(serverContent))
    localStorage.removeItem(LS_DIRTY)
  }, [])

  const value = useMemo(
    () => ({
      content,
      publishedContent,
      loading,
      dirty,
      update,
      updateMany,
      replaceAll,
      resetToPublished,
      markPublished,
      getPath: (p) => getPath(content, p),
    }),
    [content, publishedContent, loading, dirty, update, updateMany, replaceAll, resetToPublished, markPublished],
  )

  if (loading || !content) {
    return (
      <div style={{ position: 'fixed', inset: 0, display: 'grid', placeItems: 'center', background: 'var(--bg, #efece6)' }}>
        <span className="mono" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, opacity: 0.4 }}>
          LOADING CONTENT…
        </span>
      </div>
    )
  }

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
}
