import { useParams, useNavigate, Link } from 'react-router-dom'
import { useContent } from '../../context/ContentContext.jsx'
import PageHeader from '../components/PageHeader.jsx'
import {
  Button, Card, CardHeader, CardTitle, CardDescription, Field, Input, Textarea, Select,
} from '../components/ui.jsx'
import ColorInput from '../components/ColorInput.jsx'
import ImageInput from '../components/ImageInput.jsx'
import SortableList from '../components/SortableList.jsx'
import { ArrowLeft, Plus, Trash2, ExternalLink } from 'lucide-react'

export default function ProjectEditPage() {
  const { slug } = useParams()
  const nav = useNavigate()
  const { content, update } = useContent()
  const projects = content.projects
  const index = projects.findIndex((p) => p.slug === slug)
  const p = projects[index]

  if (!p) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-8 text-center">
        <p className="text-white/50 mb-4">Project "{slug}" not found.</p>
        <Link to="/admin/projects" className="text-[#ff4a1c] hover:underline">Back to projects</Link>
      </div>
    )
  }

  const setField = (k, v) => update(['projects', index, k], v)
  const setNested = (path, v) => update(['projects', index, ...path], v)

  return (
    <div>
      <PageHeader
        eyebrow={`Project · ${p.index}`}
        title={`${p.client} — ${p.title}`}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => nav('/admin/projects')}>
              <ArrowLeft className="h-3.5 w-3.5" /> Back
            </Button>
            <a
              href={`/work/${p.slug}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 h-8 px-3 text-xs text-white/70 hover:text-white"
            >
              <ExternalLink className="h-3 w-3" /> Preview
            </a>
          </div>
        }
      />

      <div className="grid gap-6">
        {/* ------------ Meta ------------ */}
        <Card>
          <CardHeader>
            <CardTitle>Project meta</CardTitle>
            <CardDescription>How it appears in listings and filters.</CardDescription>
          </CardHeader>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Index" hint="e.g. 01, 02 — shown above the card">
              <Input value={p.index} onChange={(e) => setField('index', e.target.value)} />
            </Field>
            <Field label="Year">
              <Input value={p.year} onChange={(e) => setField('year', e.target.value)} />
            </Field>
            <Field label="Client name">
              <Input value={p.client} onChange={(e) => setField('client', e.target.value)} />
            </Field>
            <Field label="Discipline pill" hint="Short label on the cover, e.g. App, Site, Brand">
              <Input value={p.discipline} onChange={(e) => setField('discipline', e.target.value)} />
            </Field>
            <Field label="Case study title" className="md:col-span-2">
              <Input value={p.title} onChange={(e) => setField('title', e.target.value)} />
            </Field>
            <Field label="Slug (URL)" hint="/work/{slug} — keep lowercase, no spaces">
              <Input value={p.slug} onChange={(e) => setField('slug', e.target.value)} />
            </Field>
            <Field label="Category">
              <Select
                value={p.category}
                onChange={(v) => setField('category', v)}
                options={content.categories.filter((c) => c !== 'All').map((c) => ({ value: c, label: c }))}
              />
            </Field>
            <Field label="Summary (card + context)" className="md:col-span-2" hint="Appears on the card and at the top of the case study.">
              <Textarea rows={2} autoGrow value={p.summary} onChange={(e) => setField('summary', e.target.value)} />
            </Field>
            <div className="md:col-span-2">
              <p className="mb-2 text-[10px] uppercase tracking-wider text-white/50 mono-font">Roles</p>
              <div className="flex flex-wrap gap-2">
                {p.role.map((r, i) => (
                  <div key={i} className="flex items-center gap-1 rounded-md border border-white/10 bg-white/[0.03] p-1">
                    <Input
                      value={r}
                      onChange={(e) => {
                        const next = [...p.role]
                        next[i] = e.target.value
                        setField('role', next)
                      }}
                      className="h-7 w-40 border-0 bg-transparent"
                    />
                    <button
                      onClick={() => setField('role', p.role.filter((_, j) => j !== i))}
                      className="text-white/40 hover:text-white px-1"
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

        {/* ------------ Colors + Cover ------------ */}
        <Card>
          <CardHeader>
            <CardTitle>Cover & colors</CardTitle>
            <CardDescription>Used on the homepage card and the case study hero.</CardDescription>
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
            <div className="rounded-lg border border-white/10 overflow-hidden">
              <div className="relative" style={{ background: p.color, aspectRatio: '16/10' }}>
                <img src={p.cover} alt="" className="h-full w-full object-cover" />
                <span
                  className="absolute top-3 left-3 text-[10px] uppercase tracking-wider px-2 py-1 rounded-full border border-white/20 backdrop-blur mono-font"
                  style={{ color: p.textOnColor, background: 'rgba(255,255,255,0.15)' }}
                >
                  {p.discipline}
                </span>
              </div>
              <div className="p-3 text-xs text-white/50">Card preview</div>
            </div>
          </div>
        </Card>

        {/* ------------ Context ------------ */}
        <Card>
          <CardHeader>
            <CardTitle>Context</CardTitle>
            <CardDescription>The paragraph below the hero on the case study.</CardDescription>
          </CardHeader>
          <Field label="Context lede">
            <Textarea rows={4} autoGrow value={p.contextLede} onChange={(e) => setField('contextLede', e.target.value)} />
          </Field>
        </Card>

        {/* ------------ Gallery ------------ */}
        <Card>
          <CardHeader>
            <CardTitle>Gallery</CardTitle>
            <CardDescription>
              Up to 4 images: index 0 = parallax band · index 1-2 = paired figures (with captions) · index 3 = full-bleed image.
            </CardDescription>
          </CardHeader>
          <div className="grid gap-4 md:grid-cols-2">
            {[0, 1, 2, 3].map((slot) => (
              <div key={slot} className="flex flex-col gap-2">
                <p className="text-[10px] uppercase tracking-wider text-white/50 mono-font">
                  Slot {slot} — {['Parallax', 'Left pair', 'Right pair', 'Full-bleed'][slot]}
                </p>
                <ImageInput
                  value={p.gallery[slot] || ''}
                  onChange={(v) => {
                    const next = [...p.gallery]
                    next[slot] = v
                    setField('gallery', next.filter((x, i) => x || i < 4))
                  }}
                />
                {(slot === 1 || slot === 2) && (
                  <Input
                    placeholder="Caption (optional)"
                    value={p.galleryCaptions[slot - 1] || ''}
                    onChange={(e) => {
                      const next = [...(p.galleryCaptions || [])]
                      next[slot - 1] = e.target.value
                      setField('galleryCaptions', next)
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* ------------ Quote ------------ */}
        <Card>
          <CardHeader>
            <CardTitle>Pull quote</CardTitle>
            <CardDescription>Big centered serif italic.</CardDescription>
          </CardHeader>
          <div className="flex flex-col gap-4">
            <Field label="Quote text">
              <Textarea rows={3} autoGrow value={p.quote.text} onChange={(e) => setNested(['quote', 'text'], e.target.value)} />
            </Field>
            <Field label="Author / attribution">
              <Input value={p.quote.author} onChange={(e) => setNested(['quote', 'author'], e.target.value)} />
            </Field>
          </div>
        </Card>

        {/* ------------ Process ------------ */}
        <Card>
          <CardHeader>
            <CardTitle>Process cards</CardTitle>
            <CardDescription>Horizontal scroll section. Drag to reorder.</CardDescription>
          </CardHeader>
          <SortableList
            items={p.process.map((it, i) => ({ ...it, __id: `pr-${i}` }))}
            getId={(it) => it.__id}
            onReorder={(next) => setField('process', next.map(({ __id, ...rest }) => rest))}
            className="flex flex-col gap-3"
            renderItem={(it, i) => (
              <div className="grid grid-cols-[1fr_2fr_auto] gap-2 items-start">
                <Field label="Title">
                  <Input value={it.k} onChange={(e) => {
                    const next = [...p.process]; next[i] = { ...p.process[i], k: e.target.value }; setField('process', next)
                  }} />
                </Field>
                <Field label="Description">
                  <Textarea rows={2} autoGrow value={it.v} onChange={(e) => {
                    const next = [...p.process]; next[i] = { ...p.process[i], v: e.target.value }; setField('process', next)
                  }} />
                </Field>
                <Button
                  variant="ghost"
                  size="icon"
                  className="mt-6"
                  onClick={() => setField('process', p.process.filter((_, j) => j !== i))}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            )}
          />
          <Button
            variant="secondary"
            size="sm"
            className="mt-3 self-start"
            onClick={() => setField('process', [...p.process, { k: 'New step', v: 'Short description.' }])}
          >
            <Plus className="h-3.5 w-3.5" /> Add process step
          </Button>
        </Card>

        {/* ------------ Outcomes ------------ */}
        <Card>
          <CardHeader>
            <CardTitle>Outcomes</CardTitle>
            <CardDescription>The closing paragraph.</CardDescription>
          </CardHeader>
          <Textarea rows={3} autoGrow value={p.outcomes} onChange={(e) => setField('outcomes', e.target.value)} />
        </Card>

        <div className="flex justify-end">
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
        </div>
      </div>
    </div>
  )
}
