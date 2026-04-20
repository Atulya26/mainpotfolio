import { useContent } from '../../context/ContentContext.jsx'
import PageHeader from '../components/PageHeader.jsx'
import { Card, CardHeader, CardTitle, CardDescription, Input, Button } from '../components/ui.jsx'
import SortableList from '../components/SortableList.jsx'
import { Plus, Trash2 } from 'lucide-react'

export default function MarqueePage() {
  const { content, update } = useContent()
  const words = content.marquee.words

  const setWords = (v) => update(['marquee', 'words'], v)

  return (
    <div>
      <PageHeader eyebrow="Home" title="Marquee" description="The big scrolling words between hero and featured work." />

      <Card>
        <CardHeader>
          <CardTitle>Words</CardTitle>
          <CardDescription>Alternating words render in italic serif. Drag to reorder.</CardDescription>
        </CardHeader>
        <SortableList
          items={words.map((v, i) => ({ v, __id: `w-${i}` }))}
          getId={(it) => it.__id}
          onReorder={(next) => setWords(next.map((x) => x.v))}
          className="flex flex-col gap-2"
          renderItem={(it, i) => (
            <div className="flex items-center gap-2">
              <Input
                value={it.v}
                onChange={(e) => {
                  const next = [...words]
                  next[i] = e.target.value
                  setWords(next)
                }}
              />
              <Button variant="ghost" size="icon" onClick={() => setWords(words.filter((_, j) => j !== i))}>
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
        />
        <Button variant="secondary" size="sm" className="mt-3 self-start" onClick={() => setWords([...words, 'New'])}>
          <Plus className="h-3.5 w-3.5" /> Add word
        </Button>
      </Card>
    </div>
  )
}
