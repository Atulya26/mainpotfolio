import { useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useContent } from '../../context/ContentContext.jsx'
import PageHeader from '../components/PageHeader.jsx'
import {
  Button, Card, CardHeader, CardTitle, CardDescription, Field, Input, Textarea, Select,
} from '../components/ui.jsx'
import ColorInput from '../components/ColorInput.jsx'
import ImageInput from '../components/ImageInput.jsx'
import BlockEditor from '../components/BlockEditor.jsx'
import { ArrowLeft, Plus, Trash2, ExternalLink } from 'lucide-react'
import { migrateProjectToBlocks } from '../../lib/blocks.js'

export default function ProjectEditPage() {
  const { slug } = useParams()
  const nav = useNavigate()
  const { content, update } = useContent()
  const projects = content.projects
  const index = projects.findIndex((p) => p.slug === slug)
  const p = projects[index]

  // Ensure the project has a `blocks` array. Legacy projects with only the
  // old fields get migrated the first time they're opened.
  useEffect(() => {
    if (p && !Array.isArray(p.blocks)) {
      update(['projects', index, 'blocks'], migrateProjectToBlocks(p))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [p?.slug])

  if (!p) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-8 text-center">
        <p className="text-white/50 mb-4">Project "{slug}" not found.</p>
        <Link to="/admin/projects">
          <Button variant="secondary"><ArrowLeft className="h-3.5 w-3.5" /> Back to projects</Button>
        </Link>
      </div>
    )
  }

  const setField = (k, v) => update(['projects', index, k], v)

  return (
    <div>
      <PageHeader
        eyebrow={`Project · ${p.index}`}
        title={`${p.client} — ${p.title}`}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => nav('/admin/projects')}>
              <ArrowLeft className="h-3.5 w-3.5" /> Back
            </Button>
            <a href={`/work/${p.slug}`} target="_blank" rel="noreferrer">
              <Button variant="secondary" size="sm">
                <ExternalLink className="h-3.5 w-3.5" /> Preview
              </Button>
            </a>
          </div>
        }
      />

      <div className="grid gap-6">
        {/* ---------- Meta ---------- */}
        <Card>
          <CardHeader>
            <CardTitle>Project meta</CardTitle>
            <CardDescription>How it appears in the index, filters and case-study intro.</CardDescription>
          </CardHeader>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Index" hint="e.g. 01, 02 — shown above the card"><Input value={p.index} onChange={(e) => setField('index', e.target.value)} /></Field>
            <Field label="Year"><Input value={p.year} onChange={(e) => setField('year', e.target.value)} /></Field>
            <Field label="Client name"><Input value={p.client} onChange={(e) => setField('client', e.target.value)} /></Field>
            <Field label="Discipline pill" hint="Short label on the cover, e.g. App, Site, Brand"><Input value={p.discipline} onChange={(e) => setField('discipline', e.target.value)} /></Field>
            <Field label="Case study title" className="md:col-span-2"><Input value={p.title} onChange={(e) => setField('title', e.target.value)} /></Field>
            <Field label="Slug (URL)" hint="/work/{slug} — lowercase, no spaces"><Input value={p.slug} onChange={(e) => setField('slug', e.target.value)} /></Field>
            <Field label="Category">
              <Select
                value={p.category}
                onChange={(v) => setField('category', v)}
                options={content.categories.filter((c) => c !== 'All').map((c) => ({ value: c, label: c }))}
              />
            </Field>
            <Field label="Summary (card + hero subtitle)" className="md:col-span-2" hint="One sentence — shown on the home grid.">
              <Textarea rows={2} autoGrow value={p.summary} onChange={(e) => setField('summary', e.target.value)} />
            </Field>
            <div className="md:col-span-2">
              <p className="mono-font mb-2 text-[10px] uppercase tracking-[0.12em] text-[var(--admin-subtle)]">Roles</p>
              <div className="flex flex-wrap gap-2">
                {p.role.map((r, i) => (
                  <div key={i} className="flex items-center gap-1 rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-panel-muted)] p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                    <Input
                      value={r}
                      onChange={(e) => {
                        const next = [...p.role]
                        next[i] = e.target.value
                        setField('role', next)
                      }}
                      className="h-8 w-40 border-0 bg-transparent px-3 shadow-none focus-visible:bg-transparent focus-visible:ring-0"
                    />
                    <button
                      onClick={() => setField('role', p.role.filter((_, j) => j !== i))}
                      className="flex h-8 w-8 items-center justify-center rounded-xl text-[var(--admin-subtle)] transition-colors hover:bg-white/6 hover:text-white"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                <Button variant="secondary" size="sm" onClick={() => setField('role', [...p.role, 'New role'])}>
                  <Plus className="h-3 w-3" /> Add role
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* ---------- Cover + Colors ---------- */}
        <Card>
          <CardHeader>
            <CardTitle>Cover & colors</CardTitle>
            <CardDescription>The hero image and brand palette for this project.</CardDescription>
          </CardHeader>
          <div className="grid gap-4 md:grid-cols-[1fr_260px]">
            <div className="flex flex-col gap-4">
              <Field label="Cover image">
                <ImageInput value={p.cover} onChange={(v) => setField('cover', v)} />
              </Field>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Background color"><ColorInput value={p.color} onChange={(v) => setField('color', v)} /></Field>
                <Field label="Text on color"><ColorInput value={p.textOnColor} onChange={(v) => setField('textOnColor', v)} /></Field>
              </div>
            </div>
            <div className="overflow-hidden rounded-[24px] border border-[var(--admin-border)] bg-[var(--admin-panel)] shadow-[var(--admin-shadow)]">
              <div className="relative" style={{ background: p.color, aspectRatio: '16/10' }}>
                <img src={p.cover} alt="" className="h-full w-full object-cover" />
                <span
                  className="mono-font absolute left-3 top-3 rounded-full border border-white/20 px-2.5 py-1 text-[10px] uppercase tracking-[0.12em]"
                  style={{ color: p.textOnColor, background: 'rgba(255,255,255,0.15)' }}
                >
                  {p.discipline}
                </span>
              </div>
              <div className="p-3 text-xs text-[var(--admin-muted)]">Card preview</div>
            </div>
          </div>
        </Card>

        {/* ---------- Block editor ---------- */}
        <Card>
          <CardHeader>
            <CardTitle>Case study content</CardTitle>
            <CardDescription>
              Everything between the hero image and the next-project card. Drag to reorder,
              hover between blocks to insert, click a block header to collapse / expand.
            </CardDescription>
          </CardHeader>
          <BlockEditor
            blocks={p.blocks || []}
            onChange={(next) => setField('blocks', next)}
          />
        </Card>

        {/* ---------- Danger zone ---------- */}
        <Card className="border-red-500/20 bg-red-500/[0.03]">
          <CardHeader>
            <CardTitle>Danger zone</CardTitle>
            <CardDescription>Destructive actions — undone only via "Discard changes".</CardDescription>
          </CardHeader>
          <Button
            variant="destructive"
            onClick={() => {
              if (confirm(`Delete "${p.client}"? This is irreversible after publish.`)) {
                update(['projects'], projects.filter((x, i) => i !== index))
                nav('/admin/projects')
              }
            }}
          >
            <Trash2 className="h-3.5 w-3.5" /> Delete project
          </Button>
        </Card>
      </div>
    </div>
  )
}
