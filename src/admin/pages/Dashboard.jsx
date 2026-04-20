import { useState } from 'react'
import { useContent } from '../../context/ContentContext.jsx'
import PageHeader from '../components/PageHeader.jsx'
import { Card, CardHeader, CardTitle, CardDescription, Button, toast } from '../components/ui.jsx'
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
        description="A bird's-eye view of your content and what's waiting to publish."
      />

      <div className="mb-8 grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((s) => (
          <Link
            key={s.label}
            to={s.to}
            className="group rounded-xl border border-white/10 bg-white/[0.03] p-4 transition-colors hover:bg-white/[0.06]"
          >
            <div className="flex items-center gap-2 text-white/40 mb-3">
              <s.icon className="h-3.5 w-3.5" />
              <p className="text-[10px] uppercase tracking-wider mono-font">{s.label}</p>
            </div>
            <p className="text-3xl font-medium text-white">{s.value}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 mb-8">
        <Card className={dirty ? 'border-[#ff4a1c]/30 bg-[#ff4a1c]/5' : ''}>
          <CardHeader>
            <CardTitle>
              {dirty ? 'You have unpublished changes' : 'Everything is published'}
            </CardTitle>
            <CardDescription>
              {dirty
                ? 'Review and publish when you\'re ready. Changes live in your browser until then.'
                : 'Your site and draft match the last published state.'}
            </CardDescription>
          </CardHeader>
          <div className="flex items-center gap-2">
            <Button variant={dirty ? 'accent' : 'secondary'} onClick={() => window.dispatchEvent(new CustomEvent('admin:open-publish'))}>
              <Upload className="h-3.5 w-3.5" /> Publish
            </Button>
            {dirty && (
              <Button
                variant="ghost"
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
              <span className="inline-flex items-center gap-2 h-9 px-4 text-sm rounded-md border border-white/20 text-white cursor-pointer hover:bg-white/10 transition-colors">
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
