import { useContent } from '../../context/ContentContext.jsx'
import PageHeader from '../components/PageHeader.jsx'
import { Card, CardHeader, CardTitle, CardDescription, Field, Input, Textarea, Button } from '../components/ui.jsx'
import SortableList from '../components/SortableList.jsx'
import { Plus, Trash2 } from 'lucide-react'

export default function PublishedPage() {
  const { content, update } = useContent()
  const pub = content.published
  const items = pub.items

  const set = (k, v) => update(['published', k], v)
  const setItems = (v) => update(['published', 'items'], v)

  return (
    <div>
      <PageHeader eyebrow="Work" title="Published" description="Essays, talks, podcast appearances." />

      <div className="grid gap-6">
        <Card>
          <CardHeader><CardTitle>Header</CardTitle></CardHeader>
          <div className="flex flex-col gap-4">
            <Field label="Eyebrow"><Input value={pub.eyebrow} onChange={(e) => set('eyebrow', e.target.value)} /></Field>
            <Field label="Heading (use \\n for line break)">
              <Textarea rows={2} autoGrow value={pub.heading} onChange={(e) => set('heading', e.target.value)} />
            </Field>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Items</CardTitle>
            <CardDescription>Drag to reorder.</CardDescription>
          </CardHeader>
          <SortableList
            items={items.map((it, i) => ({ ...it, __id: `pub-${i}` }))}
            getId={(it) => it.__id}
            onReorder={(next) => setItems(next.map(({ __id, ...rest }) => rest))}
            className="flex flex-col gap-2"
            renderItem={(it, i) => (
              <div className="grid grid-cols-[80px_2fr_1fr_auto] gap-2 items-end">
                <Field label="Year"><Input value={it.y} onChange={(e) => {
                  const next = [...items]; next[i] = { ...items[i], y: e.target.value }; setItems(next)
                }} /></Field>
                <Field label="Title"><Input value={it.t} onChange={(e) => {
                  const next = [...items]; next[i] = { ...items[i], t: e.target.value }; setItems(next)
                }} /></Field>
                <Field label="Where"><Input value={it.where} onChange={(e) => {
                  const next = [...items]; next[i] = { ...items[i], where: e.target.value }; setItems(next)
                }} /></Field>
                <Button variant="ghost" size="icon" onClick={() => setItems(items.filter((_, j) => j !== i))}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            )}
          />
          <Button
            variant="secondary"
            size="sm"
            className="mt-3 self-start"
            onClick={() => setItems([...items, { y: new Date().getFullYear().toString(), t: 'New entry', where: 'Essay' }])}
          >
            <Plus className="h-3.5 w-3.5" /> Add item
          </Button>
        </Card>
      </div>
    </div>
  )
}
