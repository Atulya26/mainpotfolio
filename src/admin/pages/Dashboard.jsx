import { useState } from 'react'
import { useContent } from '../../context/ContentContext.jsx'
import PageHeader from '../components/PageHeader.jsx'
import { Card, CardHeader, CardTitle, CardDescription, Button, Badge, toast } from '../components/ui.jsx'
import { Upload, FileText, Briefcase, Archive as ArchiveIcon, BookOpen, Zap, RefreshCw, Download, Upload as UploadIcon } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Dashboard() {
  const { content, dirty, resetToPublished, replaceAll } = useContent()
  const [importing, setImporting] = useState(false)

  const stats = [
    { icon: Briefcase, label: 'Projects', value: content.projects.length, to: '/admin/projects' },
    { icon: ArchiveIcon, label: 'Archive rows', value: content.archive.rows.length, to: '/admin/archive' },
    { icon: BookOpen, label: 'Publications', value: content.published.items.length, to: '/admin/published' },
    { icon: Zap, label: 'Capabilities', value: content.capabilitiesSection.items.length, to: '/admin/capabilities' },
  ]

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(content, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `content-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const importJson = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImporting(true)
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result)
        replaceAll(parsed)
        toast('Imported. Review and publish.', { variant: 'success' })
      } catch (err) {
        toast('Invalid JSON: ' + err.message, { variant: 'destructive' })
      } finally {
        setImporting(false)
      }
    }
    reader.readAsText(file)
  }

  return (
    <div>
      <PageHeader
        eyebrow="Overview"
        title="Dashboard"
        description="A bird's-eye view of your content, draft state, and the sections you’ll touch most often."
      />

      <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            to={s.to}
            className="group rounded-[24px] border border-[var(--admin-border)] bg-[var(--admin-panel)] p-5 shadow-[var(--admin-shadow)] transition-[transform,border-color,background-color] duration-200 hover:-translate-y-0.5 hover:border-[var(--admin-border-strong)] hover:bg-[var(--admin-panel-strong)]"
          >
            <div className="mb-4 flex items-center gap-2 text-[var(--admin-subtle)]">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--admin-border)] bg-white/[0.04]">
                <s.icon className="h-4 w-4" />
              </div>
              <p className="mono-font text-[10px] uppercase tracking-[0.12em]">{s.label}</p>
            </div>
            <p className="text-4xl font-medium tracking-[-0.04em] text-white">{s.value}</p>
          </Link>
        ))}
      </div>

      <div className="mb-8 grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className={dirty ? 'border-[#ff4a1c]/30 bg-[#ff4a1c]/5' : ''}>
          <CardHeader>
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle>{dirty ? 'You have unpublished changes' : 'Everything is published'}</CardTitle>
              {dirty ? <Badge variant="accent">Draft active</Badge> : <Badge>Synced</Badge>}
            </div>
            <CardDescription>
              {dirty
                ? 'Review and publish when you\'re ready. Changes live in your browser until then.'
                : 'Your site and draft match the last published state.'}
            </CardDescription>
          </CardHeader>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant={dirty ? 'accent' : 'secondary'} onClick={() => window.dispatchEvent(new CustomEvent('admin:open-publish'))}>
              <Upload className="h-3.5 w-3.5" /> Publish
            </Button>
            {dirty && (
              <Button
                variant="outline"
                onClick={() => {
                  if (confirm('Discard all local changes?')) resetToPublished()
                }}
              >
                <RefreshCw className="h-3.5 w-3.5" /> Discard
              </Button>
            )}
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Import / Export</CardTitle>
            <CardDescription>Backup your content or move it to another install.</CardDescription>
          </CardHeader>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={exportJson}>
              <Download className="h-3.5 w-3.5" /> Export JSON
            </Button>
            <label className="inline-flex">
              <input type="file" accept="application/json" className="hidden" onChange={importJson} />
              <span className="inline-flex h-10 items-center gap-2 rounded-xl border border-[var(--admin-border-strong)] px-4 text-sm text-white shadow-[var(--admin-shadow)] transition-[background-color,border-color,transform] duration-200 hover:bg-white/5 active:scale-[0.98]">
                <UploadIcon className="h-3.5 w-3.5" /> {importing ? 'Importing…' : 'Import JSON'}
              </span>
            </label>
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick edits</CardTitle>
          <CardDescription>Jump straight to the most-edited sections.</CardDescription>
        </CardHeader>
        <div className="flex flex-wrap gap-2">
          {[
            ['/admin/hero', 'Edit hero'],
            ['/admin/projects', 'Projects'],
            ['/admin/about', 'About page'],
            ['/admin/theme', 'Theme'],
            ['/admin/footer', 'Footer'],
          ].map(([to, label]) => (
            <Link key={to} to={to}>
              <Button variant="secondary" size="sm">
                <FileText className="h-3 w-3" /> {label}
              </Button>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  )
}
