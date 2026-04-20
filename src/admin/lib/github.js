// Minimal GitHub Contents API client for publishing content.json.
//
// Security note: the PAT lives in the browser's localStorage. This is acceptable
// for a single-user admin UI on a personal portfolio, but NEVER embed a PAT in
// committed source. Use a fine-grained token with Contents:Read/Write scoped to
// this repo only.

const GH_CFG_KEY = 'portfolio:github'

export function getGithubConfig() {
  try {
    const raw = localStorage.getItem(GH_CFG_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function setGithubConfig(cfg) {
  localStorage.setItem(GH_CFG_KEY, JSON.stringify(cfg))
}

export function clearGithubConfig() {
  localStorage.removeItem(GH_CFG_KEY)
}

// Encode a string as base64 correctly for UTF-8
function b64encode(str) {
  return btoa(unescape(encodeURIComponent(str)))
}

function b64decode(str) {
  return decodeURIComponent(escape(atob(str)))
}

async function gh(cfg, path, init = {}) {
  const url = `https://api.github.com${path}`
  const res = await fetch(url, {
    ...init,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${cfg.token}`,
      'X-GitHub-Api-Version': '2022-11-28',
      ...(init.body ? { 'Content-Type': 'application/json' } : {}),
      ...(init.headers || {}),
    },
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`GitHub ${res.status}: ${text}`)
  }
  return res.json()
}

export async function verifyToken(cfg) {
  const user = await gh(cfg, '/user')
  return user
}

export async function getContentFile(cfg) {
  const path = cfg.path || 'public/content.json'
  const branch = cfg.branch || 'main'
  return gh(
    cfg,
    `/repos/${cfg.owner}/${cfg.repo}/contents/${encodeURIComponent(path)}?ref=${encodeURIComponent(branch)}`,
  )
}

export async function putContentFile(cfg, newContentObj, message, sha) {
  const path = cfg.path || 'public/content.json'
  const branch = cfg.branch || 'main'
  const pretty = JSON.stringify(newContentObj, null, 2) + '\n'
  return gh(cfg, `/repos/${cfg.owner}/${cfg.repo}/contents/${encodeURIComponent(path)}`, {
    method: 'PUT',
    body: JSON.stringify({
      message: message || 'chore(content): update content.json via admin',
      content: b64encode(pretty),
      sha,
      branch,
    }),
  })
}

export async function fetchPublishedContent(cfg) {
  const file = await getContentFile(cfg)
  const text = b64decode(file.content.replace(/\n/g, ''))
  return { content: JSON.parse(text), sha: file.sha }
}
