import { useMemo, useState } from 'react'
import {
  Dialog, DialogHeader, Button, Input, Field, Label, toast,
} from './components/ui.jsx'
import { getGithubConfig, setGithubConfig, fetchPublishedContent, putContentFile, verifyToken } from './lib/github.js'
import { useContent } from '../context/ContentContext.jsx'
import { ShieldCheck, ShieldOff, Download, Upload } from 'lucide-react'

export default function PublishDialog({ open, onOpenChange }) {
  const { content, publishedContent, markPublished } = useContent()
  const [cfg, setCfg] = useState(() => getGithubConfig() || { owner: '', repo: '', branch: 'main', path: 'public/content.json', token: '' })
  const [message, setMessage] = useState('Update portfolio content')
  const [busy, setBusy] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [verified, setVerified] = useState(null) // null | true | false
  const [user, setUser] = useState(null)

  const diff = useMemo(() => {
    if (!publishedContent) return []
    const keys = new Set([...Object.keys(content), ...Object.keys(publishedContent)])
    return Array.from(keys)
      .filter((k) => JSON.stringify(content[k]) !== JSON.stringify(publishedContent[k]))
  }, [content, publishedContent])

  const saveCfg = () => setGithubConfig(cfg)
  const handleOpenChange = (next) => {
    if (!next) setVerified(null)
    onOpenChange(next)
  }

  const verify = async () => {
    setVerifying(true)
    try {
      const u = await verifyToken(cfg)
      setUser(u)
      setVerified(true)
      saveCfg()
      toast(`Connected as @${u.login}`, { variant: 'success' })
    } catch (e) {
      setVerified(false)
      toast('Token failed: ' + e.message, { variant: 'destructive' })
    } finally {
      setVerifying(false)
    }
  }

  const publish = async () => {
    if (!cfg.owner || !cfg.repo || !cfg.token) {
      toast('Fill in owner, repo and token.', { variant: 'destructive' })
      return
    }
    saveCfg()
    setBusy(true)
    try {
      const { sha } = await fetchPublishedContent(cfg)
      await putContentFile(cfg, content, message, sha)
      markPublished(content)
      toast('Published. Your host should redeploy shortly.', { variant: 'success' })
      handleOpenChange(false)
    } catch (e) {
      toast('Publish failed: ' + e.message, { variant: 'destructive' })
    } finally {
      setBusy(false)
    }
  }

  const downloadJson = () => {
    const blob = new Blob([JSON.stringify(content, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'content.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogHeader onClose={() => handleOpenChange(false)}>
        <h2 className="text-lg font-medium text-white">Publish changes</h2>
        <p className="mt-1 text-sm leading-6 text-[var(--admin-muted)]">
          {diff.length === 0
            ? 'No changes since the last published version.'
            : `${diff.length} section${diff.length === 1 ? '' : 's'} changed.`}
        </p>
      </DialogHeader>

      {diff.length > 0 && (
        <div className="mb-4 rounded-[22px] border border-[var(--admin-border)] bg-[var(--admin-panel-muted)] p-4">
          <p className="mono-font mb-2 text-[10px] uppercase tracking-[0.12em] text-[var(--admin-subtle)]">Changed</p>
          <div className="flex flex-wrap gap-1.5">
            {diff.map((k) => (
              <span key={k} className="rounded-xl border border-[var(--admin-border)] bg-white/[0.04] px-2.5 py-1 text-xs text-white">{k}</span>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4">
        <div className="grid gap-3 md:grid-cols-2">
          <Field label="GitHub owner">
            <Input value={cfg.owner} onChange={(e) => setCfg({ ...cfg, owner: e.target.value })} placeholder="Atulya26" />
          </Field>
          <Field label="Repository">
            <Input value={cfg.repo} onChange={(e) => setCfg({ ...cfg, repo: e.target.value })} placeholder="mainpotfolio" />
          </Field>
          <Field label="Branch">
            <Input value={cfg.branch} onChange={(e) => setCfg({ ...cfg, branch: e.target.value })} placeholder="main" />
          </Field>
          <Field label="File path">
            <Input value={cfg.path} onChange={(e) => setCfg({ ...cfg, path: e.target.value })} placeholder="public/content.json" />
          </Field>
        </div>

        <Field
          label="Personal Access Token"
          hint="Fine-grained token with Contents: read/write scoped to this repo. Stored only in your browser."
        >
          <Input
            type="password"
            value={cfg.token}
            onChange={(e) => { setCfg({ ...cfg, token: e.target.value }); setVerified(null) }}
            placeholder="github_pat_…"
          />
        </Field>

        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={verify} disabled={verifying || !cfg.token}>
            {verifying ? 'Verifying…' : 'Verify token'}
          </Button>
          {verified === true && (
            <span className="flex items-center gap-1 text-xs text-emerald-400">
              <ShieldCheck className="h-3 w-3" /> {user?.login}
            </span>
          )}
          {verified === false && (
            <span className="flex items-center gap-1 text-xs text-red-400">
              <ShieldOff className="h-3 w-3" /> Invalid
            </span>
          )}
        </div>

        <Field label="Commit message">
          <Input value={message} onChange={(e) => setMessage(e.target.value)} />
        </Field>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--admin-border)] pt-4">
          <Button variant="outline" size="sm" onClick={downloadJson}>
            <Download className="h-3.5 w-3.5" /> Export JSON
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => handleOpenChange(false)}>Cancel</Button>
            <Button variant="accent" onClick={publish} disabled={busy || diff.length === 0}>
              <Upload className="h-3.5 w-3.5" />
              {busy ? 'Publishing…' : 'Publish to GitHub'}
            </Button>
          </div>
        </div>
      </div>
    </Dialog>
  )
}
