import { useContent } from '../../context/ContentContext.jsx'
import PageHeader from '../components/PageHeader.jsx'
import { Card, CardHeader, CardTitle, CardDescription, Field, Input, Textarea, Button } from '../components/ui.jsx'
import SortableList from '../components/SortableList.jsx'
import { Plus, Trash2 } from 'lucide-react'

export default function CapabilitiesPage() {
  const { content, update } = useContent()
  const section = content.capabilitiesSection
  const items = section.items

  const setItems = (v) => update(['capabilitiesSection', 'items'], v)

  return (
    <div>
      <PageHeader eyebrow="Home" title="Capabilities" description="The sticky-scrolling list showcasing what you do." />

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Section header</CardTitle>
          </CardHeader>
          <Field label="Eyebrow">
            <Input value={section.eyebrow} onChange={(e) => update(['capabilitiesSection', 'eyebrow'], e.target.value)} />
          </Field>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Items</CardTitle>
            <CardDescription>Each item gets its own sticky frame while scrolling.</CardDescription>
          </CardHeader>
          <SortableList
            items={items.map((it, i) => ({ ...it, __id: `cap-${i}` }))}
            getId={(it) => it.__id}
            onReorder={(next) => setItems(next.map(({ __id, ...rest }) => rest))}
            className="flex flex-col gap-3"
            renderItem={(it, i) => (
              <div className="grid grid-cols-[1fr_2fr_auto] gap-2 items-start">
                <Field label="Title">
                  <Input value={it.k} onChange={(e) => {
                    const next = [...items]; next[i] = { ...items[i], k: e.target.value }; setItems(next)
                  }} />
                </Field>
                <Field label="Description">
                  <Textarea rows={2} autoGrow value={it.v} onChange={(e) => {
                    const next = [...items]; next[i] = { ...items[i], v: e.target.value }; setItems(next)
                  }} />
                </Field>
                <Button variant="ghost" size="icon" className="mt-6" onClick={() => setItems(items.filter((_, j) => j !== i))}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            )}
          />
          <Button
            variant="secondary"
            size="sm"
            className="mt-3 self-start"
            onClick={() => setItems([...items, { k: 'New capability', v: 'Short description.' }])}
          >
            <Plus className="h-3.5 w-3.5" /> Add capability
          </Button>
        </Card>
      </div>
    </div>
  )
}
