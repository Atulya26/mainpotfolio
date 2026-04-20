const PW_KEY = 'portfolio:admin-pw'
const SESSION_KEY = 'portfolio:admin-session'

async function sha256(str) {
  const buf = new TextEncoder().encode(str)
  const hash = await crypto.subtle.digest('SHA-256', buf)
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export async function setPassword(pw) {
  const hash = await sha256(pw)
  localStorage.setItem(PW_KEY, hash)
}

export async function checkPassword(pw) {
  const saved = localStorage.getItem(PW_KEY)
  if (!saved) return false
  const hash = await sha256(pw)
  return hash === saved
}

export function hasPassword() {
  return !!localStorage.getItem(PW_KEY)
}

export function unlock() {
  sessionStorage.setItem(SESSION_KEY, '1')
}

export function lock() {
  sessionStorage.removeItem(SESSION_KEY)
}

export function isUnlocked() {
  return sessionStorage.getItem(SESSION_KEY) === '1'
}

export function resetPassword() {
  localStorage.removeItem(PW_KEY)
  sessionStorage.removeItem(SESSION_KEY)
}
