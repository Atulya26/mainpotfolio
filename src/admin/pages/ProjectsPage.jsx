import { useContent } from '../../context/ContentContext.jsx'
import PageHeader from '../components/PageHeader.jsx'
import { Button, Card, CardHeader, CardTitle, CardDescription, Input, Field } from '../components/ui.jsx'
import SortableList from '../components/SortableList.jsx'
import { Link } from 'react-router-dom'
import { Plus, Trash2, Copy, Pencil, ExternalLink } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function slugify(s) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

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
        <div className="flex flex-wrap gap-2 items-center">
          {categories.map((c, i) => (
            <div key={i} className="flex items-center gap-1 rounded-md border border-white/10 bg-white/[0.03] p-1">
              <Input
                value={c}
                onChange={(e) => {
                  const next = [...categories]
                  next[i] = e.target.value
                  setCategories(next)
                }}
                className="h-7 w-36 border-0 bg-transparent"
              />
              {c !== 'All' && (
                <button
                  onClick={() => setCategories(categories.filter((_, j) => j !== i))}
                  className="text-white/40 hover:text-white px-1"
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
        className="flex flex-col gap-2"
        renderItem={(p, i) => (
          <div className="group flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-3 hover:bg-white/[0.06]">
            <img src={p.cover} alt="" className="h-14 w-24 rounded-md object-cover shrink-0" style={{ background: p.color }} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-white/40 mono-font">
                <span>{p.index}</span>
                <span>·</span>
                <span>{p.year}</span>
                <span>·</span>
                <span>{p.category}</span>
              </div>
              <p className="truncate text-sm font-medium text-white">
                {p.client} <span className="text-white/40">— {p.title}</span>
              </p>
              <p className="truncate text-xs text-white/50">{p.summary}</p>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <a
                href={`/work/${p.slug}`}
                target="_blank"
                rel="noreferrer"
                className="rounded-md p-2 text-white/50 hover:bg-white/10 hover:text-white"
                title="Preview"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
              <button onClick={() => duplicate(p)} className="rounded-md p-2 text-white/50 hover:bg-white/10 hover:text-white" title="Duplicate">
                <Copy className="h-3.5 w-3.5" />
              </button>
              <Link to={`/admin/projects/${p.slug}`} className="rounded-md p-2 text-white/50 hover:bg-white/10 hover:text-white" title="Edit">
                <Pencil className="h-3.5 w-3.5" />
              </Link>
              <button onClick={() => remove(p)} className="rounded-md p-2 text-red-400/70 hover:bg-red-500/10 hover:text-red-400" title="Delete">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      />

      {projects.length === 0 && (
        <div className="rounded-lg border border-dashed border-white/10 p-12 text-center text-white/40">
          No projects yet. Click <strong className="text-white">New project</strong> above.
        </div>
      )}
    </div>
  )
}
