import { useContent } from '../../context/ContentContext.jsx'
import PageHeader from '../components/PageHeader.jsx'
import { Button, Card, CardHeader, CardTitle, CardDescription, Input, Field } from '../components/ui.jsx'
import SortableList from '../components/SortableList.jsx'
import { Link } from 'react-router-dom'
import { Plus, Trash2, Copy, Pencil, ExternalLink } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function ProjectsPage() {
  const { content, update } = useContent()
  const projects = content.projects
  const categories = content.categories
  const nav = useNavigate()

  const setProjects = (v) => update(['projects'], v)
  const setCategories = (v) => update(['categories'], v)

  const createProject = () => {
    const newSlug = `new-project-${projects.length + 1}`
    const next = {
      slug: newSlug,
      index: String(projects.length + 1).padStart(2, '0'),
      title: 'New Case Study Title',
      client: 'Client Name',
      year: new Date().getFullYear().toString(),
      category: categories.find((c) => c !== 'All') || 'Other',
      role: ['Product Design'],
      discipline: 'App',
      color: '#222222',
      textOnColor: '#ffffff',
      cover: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=1600&q=80&auto=format&fit=crop',
      summary: 'A short lede about this project.',
      contextLede: 'A paragraph setting up the context.',
      gallery: [],
      galleryCaptions: [],
      quote: { text: 'A great pull quote.', author: '— Someone Important' },
      process: [
        { k: 'Listening', v: 'A short note.' },
        { k: 'Making', v: 'A short note.' },
      ],
      outcomes: 'What changed.',
    }
    setProjects([...projects, next])
    nav(`/admin/projects/${newSlug}`)
  }

  const duplicate = (p) => {
    const newSlug = `${p.slug}-copy`
    setProjects([...projects, { ...p, slug: newSlug, client: p.client + ' (copy)' }])
  }

  const remove = (p) => {
    if (confirm(`Delete "${p.client}"? This cannot be undone until you discard changes.`)) {
      setProjects(projects.filter((x) => x.slug !== p.slug))
    }
  }

  return (
    <div>
      <PageHeader
        eyebrow="Work"
        title="Projects"
        description="Your case studies. Drag to reorder — ordering controls the homepage grid."
        actions={
          <Button onClick={createProject} variant="accent">
            <Plus className="h-3.5 w-3.5" /> New project
          </Button>
        }
      />

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Categories (filter chips)</CardTitle>
          <CardDescription>The chips shown above the grid. Keep "All" first.</CardDescription>
        </CardHeader>
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((c, i) => (
            <div key={i} className="flex items-center gap-1 rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-panel-muted)] p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
              <Input
                value={c}
                onChange={(e) => {
                  const next = [...categories]
                  next[i] = e.target.value
                  setCategories(next)
                }}
                className="h-8 w-36 border-0 bg-transparent px-3 shadow-none focus-visible:bg-transparent focus-visible:ring-0"
              />
              {c !== 'All' && (
                <button
                  onClick={() => setCategories(categories.filter((_, j) => j !== i))}
                  className="rounded-xl px-2 py-1 text-[var(--admin-subtle)] transition-colors hover:bg-white/6 hover:text-white"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              )}
            </div>
          ))}
          <Button variant="secondary" size="sm" onClick={() => setCategories([...categories, 'New'])}>
            <Plus className="h-3 w-3" /> Add category
          </Button>
        </div>
      </Card>

      <SortableList
        items={projects}
        getId={(p) => p.slug}
        onReorder={setProjects}
        className="flex flex-col gap-3"
        renderItem={(p) => (
          <div className="group flex flex-col gap-4 rounded-[24px] border border-[var(--admin-border)] bg-[var(--admin-panel)] p-4 shadow-[var(--admin-shadow)] transition-[border-color,background-color,transform] duration-200 hover:-translate-y-0.5 hover:border-[var(--admin-border-strong)] hover:bg-[var(--admin-panel-strong)] md:flex-row md:items-center">
            <img
              src={p.cover}
              alt=""
              className="h-40 w-full shrink-0 rounded-[18px] object-cover md:h-20 md:w-36"
              style={{ background: p.color }}
            />
            <div className="min-w-0 flex-1">
              <div className="mono-font flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.12em] text-[var(--admin-subtle)]">
                <span>{p.index}</span>
                <span>·</span>
                <span>{p.year}</span>
                <span>·</span>
                <span>{p.category}</span>
              </div>
              <p className="mt-2 truncate text-base font-medium tracking-[-0.02em] text-white">
                {p.client} <span className="text-white/40">— {p.title}</span>
              </p>
              <p className="mt-1 truncate text-sm text-[var(--admin-muted)]">{p.summary}</p>
            </div>
            <div className="flex items-center gap-1 opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100">
              <a
                href={`/work/${p.slug}`}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl p-2 text-[var(--admin-subtle)] transition-colors hover:bg-white/10 hover:text-white"
                title="Preview"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
              <button
                onClick={() => duplicate(p)}
                className="rounded-xl p-2 text-[var(--admin-subtle)] transition-colors hover:bg-white/10 hover:text-white"
                title="Duplicate"
              >
                <Copy className="h-3.5 w-3.5" />
              </button>
              <Link
                to={`/admin/projects/${p.slug}`}
                className="rounded-xl p-2 text-[var(--admin-subtle)] transition-colors hover:bg-white/10 hover:text-white"
                title="Edit"
              >
                <Pencil className="h-3.5 w-3.5" />
              </Link>
              <button
                onClick={() => remove(p)}
                className="rounded-xl p-2 text-red-400/70 transition-colors hover:bg-red-500/10 hover:text-red-400"
                title="Delete"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      />

      {projects.length === 0 && (
        <div className="rounded-[24px] border border-dashed border-[var(--admin-border)] bg-[var(--admin-panel-muted)] p-12 text-center text-[var(--admin-muted)]">
          No projects yet. Click <strong className="text-white">New project</strong> above.
        </div>
      )}
    </div>
  )
}
