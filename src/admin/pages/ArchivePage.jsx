import { useContent } from '../../context/ContentContext.jsx'
import PageHeader from '../components/PageHeader.jsx'
import { Card, CardHeader, CardTitle, CardDescription, Field, Input, Textarea, Button } from '../components/ui.jsx'
import SortableList from '../components/SortableList.jsx'
import { Plus, Trash2 } from 'lucide-react'

export default function ArchivePage() {
  const { content, update } = useContent()
  const arc = content.archive
  const rows = arc.rows

  const set = (k, v) => update(['archive', k], v)
  const setRows = (v) => update(['archive', 'rows'], v)

  return (
    <div>
      <PageHeader
        eyebrow="Work"
        title="Archive"
        description="The longer list shown on /archive. Shorter notes on shipped work."
      />

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Header</CardTitle>
          </CardHeader>
          <div className="flex flex-col gap-4">
            <Field label="Eyebrow"><Input value={arc.eyebrow} onChange={(e) => set('eyebrow', e.target.value)} /></Field>
            <Field label="Heading (use \\n for line break)">
              <Textarea rows={2} autoGrow value={arc.heading} onChange={(e) => set('heading', e.target.value)} />
            </Field>
            <Field label="Subtext"><Input value={arc.sub} onChange={(e) => set('sub', e.target.value)} /></Field>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rows</CardTitle>
            <CardDescription>Each row becomes a line in the archive table. Drag to reorder.</CardDescription>
          </CardHeader>
          <div className="hidden md:grid grid-cols-[80px_1fr_160px_auto] gap-2 mb-2 pl-7 text-[10px] uppercase tracking-wider text-white/40 mono-font">
            <span>Year</span><span>Project</span><span>Category</span><span />
          </div>
          <SortableList
            items={rows.map((r, i) => ({ ...r, __id: `arc-${i}` }))}
            getId={(it) => it.__id}
            onReorder={(next) => setRows(next.map(({ __id, ...rest }) => rest))}
            className="flex flex-col gap-2"
            renderItem={(r, i) => (
              <div className="grid grid-cols-[80px_1fr_160px_auto] gap-2 items-center">
                <Input value={r.y} onChange={(e) => {
                  const next = [...rows]; next[i] = { ...rows[i], y: e.target.value }; setRows(next)
                }} />
                <Input value={r.t} onChange={(e) => {
                  const next = [...rows]; next[i] = { ...rows[i], t: e.target.value }; setRows(next)
                }} />
                <Input value={r.c} onChange={(e) => {
                  const next = [...rows]; next[i] = { ...rows[i], c: e.target.value }; setRows(next)
                }} />
                <Button variant="ghost" size="icon" onClick={() => setRows(rows.filter((_, j) => j !== i))}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            )}
          />
          <Button
            variant="secondary"
            size="sm"
            className="mt-3 self-start"
            onClick={() => setRows([...rows, { y: new Date().getFullYear().toString(), t: 'New entry', c: 'Category' }])}
          >
            <Plus className="h-3.5 w-3.5" /> Add row
          </Button>
        </Card>
      </div>
    </div>
  )
}
