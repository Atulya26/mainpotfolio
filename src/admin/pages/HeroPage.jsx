import { useContent } from '../../context/ContentContext.jsx'
import PageHeader from '../components/PageHeader.jsx'
import { Card, CardHeader, CardTitle, CardDescription, Field, Input, Textarea, Button } from '../components/ui.jsx'
import ImageInput from '../components/ImageInput.jsx'
import { Plus, Trash2 } from 'lucide-react'
import SortableList from '../components/SortableList.jsx'

export default function HeroPage() {
  const { content, update } = useContent()
  const h = content.hero

  const set = (k, v) => update(['hero', k], v)
  const setLines = (v) => update(['hero', 'titleLines'], v)
  const setTicker = (v) => update(['hero', 'ticker'], v)

  return (
    <div>
      <PageHeader eyebrow="Home" title="Hero section" description="The first thing visitors read." />

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Headline</CardTitle>
            <CardDescription>Each entry becomes its own line. Drag to reorder.</CardDescription>
          </CardHeader>
          <SortableList
            items={h.titleLines.map((v, i) => ({ v, __id: `line-${i}` }))}
            getId={(it) => it.__id}
            onReorder={(next) => setLines(next.map((x) => x.v))}
            className="flex flex-col gap-2"
            renderItem={(it, i) => (
              <div className="flex items-center gap-2">
                <Input
                  value={it.v}
                  onChange={(e) => {
                    const next = [...h.titleLines]
                    next[i] = e.target.value
                    setLines(next)
                  }}
                />
                <Button variant="ghost" size="icon" onClick={() => setLines(h.titleLines.filter((_, j) => j !== i))}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            )}
          />
          <Button
            variant="secondary"
            size="sm"
            className="mt-3 self-start"
            onClick={() => setLines([...h.titleLines, 'New line'])}
          >
            <Plus className="h-3.5 w-3.5" /> Add line
          </Button>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Meta strip</CardTitle>
            <CardDescription>Small labels above the headline.</CardDescription>
          </CardHeader>
          <div className="flex flex-col gap-4">
            <Field label="Left"><Input value={h.metaLeft} onChange={(e) => set('metaLeft', e.target.value)} /></Field>
            <Field label="Right"><Input value={h.metaRight} onChange={(e) => set('metaRight', e.target.value)} /></Field>
            <Field label="Scroll hint"><Input value={h.scrollHint} onChange={(e) => set('scrollHint', e.target.value)} /></Field>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Showreel media</CardTitle>
            <CardDescription>The image in the bottom-left.</CardDescription>
          </CardHeader>
          <div className="flex flex-col gap-4">
            <Field label="Image"><ImageInput value={h.mediaSrc} onChange={(v) => set('mediaSrc', v)} /></Field>
            <Field label="Tag (mono label)"><Input value={h.mediaTag} onChange={(e) => set('mediaTag', e.target.value)} /></Field>
          </div>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Aside</CardTitle>
            <CardDescription>The paragraph on the right and status ticker.</CardDescription>
          </CardHeader>
          <div className="flex flex-col gap-4">
            <Field label="Lede (paragraph)">
              <Textarea rows={3} autoGrow value={h.asideLede} onChange={(e) => set('asideLede', e.target.value)} />
            </Field>
            <div>
              <p className="mb-2 text-[10px] uppercase tracking-wider text-white/50 mono-font">Ticker items</p>
              <div className="flex flex-col gap-2">
                {h.ticker.map((t, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Input
                      value={t}
                      onChange={(e) => {
                        const next = [...h.ticker]
                        next[i] = e.target.value
                        setTicker(next)
                      }}
                    />
                    <Button variant="ghost" size="icon" onClick={() => setTicker(h.ticker.filter((_, j) => j !== i))}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
                <Button variant="secondary" size="sm" className="self-start" onClick={() => setTicker([...h.ticker, '● New'])}>
                  <Plus className="h-3.5 w-3.5" /> Add item
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
