import { useEffect, useState } from 'react'
import AdminSidebar from './AdminSidebar.jsx'
import { Toaster, Button } from './components/ui.jsx'
import PublishDialog from './PublishDialog.jsx'
import { Upload, ExternalLink, RefreshCw } from 'lucide-react'
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
    <div className="admin-root flex h-screen overflow-hidden">
      <AdminSidebar onLock={onLock} />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="flex items-center justify-between gap-4 border-b border-white/10 px-6 py-3 bg-[#0b0b0f]/80 backdrop-blur shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <p className="text-sm text-white/60 shrink-0">Content editor</p>
            {dirty && (
              <span className="rounded-full bg-[#ff4a1c]/15 px-2 py-0.5 text-[10px] uppercase tracking-wider text-[#ff4a1c] mono-font whitespace-nowrap">
                Unpublished changes
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
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
        </header>

        <main className="flex-1 overflow-y-auto admin-scroll">
          <div className="mx-auto max-w-5xl p-6 md:p-10">
            {children}
          </div>
        </main>
      </div>

      <Toaster />
      <PublishDialog open={publishOpen} onOpenChange={setPublishOpen} />
    </div>
  )
}
