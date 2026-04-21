import { useEffect, useState } from 'react'
import { Upload, ExternalLink, RefreshCw } from 'lucide-react'
import AdminSidebar from './AdminSidebar.jsx'
import PublishDialog from './PublishDialog.jsx'
import { Badge, Button, Toaster } from './components/ui.jsx'
import { useContent } from '../context/ContentContext.jsx'

export default function AdminShell({ onLock, children }) {
  const [publishOpen, setPublishOpen] = useState(false)
  const { dirty, resetToPublished } = useContent()

  useEffect(() => {
    const open = () => setPublishOpen(true)
    window.addEventListener('admin:open-publish', open)
    return () => window.removeEventListener('admin:open-publish', open)
  }, [])

  return (
    <div className="admin-root flex min-h-screen overflow-hidden">
      <AdminSidebar onLock={onLock} />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 shrink-0 border-b border-[var(--admin-border)] bg-[var(--admin-bg-elevated)] px-5 py-4 backdrop-blur-xl md:px-7">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="mono-font text-[10px] uppercase tracking-[0.12em] text-[var(--admin-subtle)]">
                Content workspace
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <p className="shrink-0 text-sm font-medium text-white">Admin control room</p>
                {dirty ? <Badge variant="accent">Draft changes</Badge> : <Badge>In sync</Badge>}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {dirty && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (confirm('Discard all local changes?')) resetToPublished()
                  }}
                >
                  <RefreshCw className="h-3.5 w-3.5" /> Discard
                </Button>
              )}

              <a href="/" target="_blank" rel="noreferrer">
                <Button variant="outline" size="sm">
                  <ExternalLink className="h-3.5 w-3.5" /> Preview
                </Button>
              </a>

              <Button onClick={() => setPublishOpen(true)} variant={dirty ? 'accent' : 'secondary'}>
                <Upload className="h-3.5 w-3.5" /> Publish
              </Button>
            </div>
          </div>
        </header>

        <main className="admin-scroll flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-6xl p-5 md:p-7 lg:p-8">
            {children}
          </div>
        </main>
      </div>

      <Toaster />
      <PublishDialog open={publishOpen} onOpenChange={setPublishOpen} />
    </div>
  )
}
