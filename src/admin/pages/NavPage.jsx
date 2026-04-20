import { useContent } from '../../context/ContentContext.jsx'
import PageHeader from '../components/PageHeader.jsx'
import { Card, CardHeader, CardTitle, CardDescription, Field, Input, Button } from '../components/ui.jsx'
import { Plus, Trash2 } from 'lucide-react'
import SortableList from '../components/SortableList.jsx'

export default function NavPage() {
  const { content, update } = useContent()
  const links = content.nav.links
  const menuItems = content.nav.menuItems

  const setLinks = (v) => update(['nav', 'links'], v)
  const setMenu = (v) => update(['nav', 'menuItems'], v)

  return (
    <div>
      <PageHeader eyebrow="Global" title="Navigation" description="Top-bar links and fullscreen menu items." />

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top navigation</CardTitle>
            <CardDescription>The pill links shown in the header on desktop.</CardDescription>
          </CardHeader>
          <SortableList
            items={links.map((l, i) => ({ ...l, __id: `link-${i}` }))}
            getId={(it) => it.__id}
            onReorder={(next) => setLinks(next.map(({ __id, ...rest }) => rest))}
            className="flex flex-col gap-2"
            renderItem={(l, i) => (
              <div className="grid grid-cols-[60px_1fr_1fr_70px_auto] gap-2 items-end">
                <Field label="Num">
                  <Input value={l.num} onChange={(e) => {
                    const next = [...links]; next[i] = { ...l, num: e.target.value }; setLinks(next)
                  }} />
                </Field>
                <Field label="Label">
                  <Input value={l.label} onChange={(e) => {
                    const next = [...links]; next[i] = { ...l, label: e.target.value }; setLinks(next)
                  }} />
                </Field>
                <Field label="Path">
                  <Input value={l.path} onChange={(e) => {
                    const next = [...links]; next[i] = { ...l, path: e.target.value }; setLinks(next)
                  }} />
                </Field>
                <Field label="Count">
                  <Input type="number" value={l.count} onChange={(e) => {
                    const next = [...links]; next[i] = { ...l, count: Number(e.target.value) }; setLinks(next)
                  }} />
                </Field>
                <Button variant="ghost" size="icon" onClick={() => setLinks(links.filter((_, j) => j !== i))}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            )}
          />
          <Button
            variant="secondary"
            size="sm"
            className="mt-3 self-start"
            onClick={() => setLinks([...links, { num: String(links.length + 1).padStart(2, '0'), label: 'New', path: '/', count: 0 }])}
          >
            <Plus className="h-3.5 w-3.5" /> Add link
          </Button>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Menu modal</CardTitle>
            <CardDescription>The big fullscreen menu.</CardDescription>
          </CardHeader>
          <SortableList
            items={menuItems.map((m, i) => ({ ...m, __id: `menu-${i}` }))}
            getId={(it) => it.__id}
            onReorder={(next) => setMenu(next.map(({ __id, ...rest }) => rest))}
            className="flex flex-col gap-2"
            renderItem={(m, i) => (
              <div className="grid grid-cols-[60px_1fr_1fr_auto] gap-2 items-end">
                <Field label="Num">
                  <Input value={m.num} onChange={(e) => {
                    const next = [...menuItems]; next[i] = { ...m, num: e.target.value }; setMenu(next)
                  }} />
                </Field>
                <Field label="Label">
                  <Input value={m.label} onChange={(e) => {
                    const next = [...menuItems]; next[i] = { ...m, label: e.target.value }; setMenu(next)
                  }} />
                </Field>
                <Field label="Path">
                  <Input value={m.path} onChange={(e) => {
                    const next = [...menuItems]; next[i] = { ...m, path: e.target.value }; setMenu(next)
                  }} />
                </Field>
                <Button variant="ghost" size="icon" onClick={() => setMenu(menuItems.filter((_, j) => j !== i))}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            )}
          />
          <Button
            variant="secondary"
            size="sm"
            className="mt-3 self-start"
            onClick={() => setMenu([...menuItems, { num: String(menuItems.length).padStart(2, '0'), label: 'New', path: '/' }])}
          >
            <Plus className="h-3.5 w-3.5" /> Add menu item
          </Button>
        </Card>
      </div>
    </div>
  )
}
