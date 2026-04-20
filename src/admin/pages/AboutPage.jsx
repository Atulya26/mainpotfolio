import { useContent } from '../../context/ContentContext.jsx'
import PageHeader from '../components/PageHeader.jsx'
import { Card, CardHeader, CardTitle, CardDescription, Field, Input, Textarea, Button } from '../components/ui.jsx'
import ImageInput from '../components/ImageInput.jsx'
import SortableList from '../components/SortableList.jsx'
import { Plus, Trash2 } from 'lucide-react'

export default function AboutPage() {
  const { content, update } = useContent()
  const a = content.about

  const set = (k, v) => update(['about', k], v)
  const setBio = (v) => set('bio', v)
  const setExp = (v) => set('experience', v)
  const setClients = (v) => set('clients', v)

  return (
    <div>
      <PageHeader eyebrow="Pages" title="About page" description="The full /about page: bio, experience and clients." />

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Header</CardTitle>
          </CardHeader>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Eyebrow"><Input value={a.eyebrow} onChange={(e) => set('eyebrow', e.target.value)} /></Field>
            <div />
            <Field label="Title line 1"><Input value={a.titleLine1} onChange={(e) => set('titleLine1', e.target.value)} /></Field>
            <Field label="Title line 2 (serif italic)"><Input value={a.titleLine2} onChange={(e) => set('titleLine2', e.target.value)} /></Field>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Portrait</CardTitle>
          </CardHeader>
          <div className="grid gap-4 md:grid-cols-[260px_1fr]">
            <ImageInput value={a.image} onChange={(v) => set('image', v)} aspect="3/4" />
            <Field label="Image tag"><Input value={a.imageTag} onChange={(e) => set('imageTag', e.target.value)} /></Field>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bio</CardTitle>
            <CardDescription>Paragraphs. First one renders larger (lede).</CardDescription>
          </CardHeader>
          <SortableList
            items={a.bio.map((v, i) => ({ v, __id: `bio-${i}` }))}
            getId={(it) => it.__id}
            onReorder={(next) => setBio(next.map((x) => x.v))}
            className="flex flex-col gap-3"
            renderItem={(it, i) => (
              <div className="grid grid-cols-[1fr_auto] gap-2">
                <Textarea rows={3} autoGrow value={it.v} onChange={(e) => {
                  const next = [...a.bio]; next[i] = e.target.value; setBio(next)
                }} />
                <Button variant="ghost" size="icon" className="mt-1" onClick={() => setBio(a.bio.filter((_, j) => j !== i))}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            )}
          />
          <Button variant="secondary" size="sm" className="mt-3 self-start" onClick={() => setBio([...a.bio, 'New paragraph.'])}>
            <Plus className="h-3.5 w-3.5" /> Add paragraph
          </Button>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Experience</CardTitle>
          </CardHeader>
          <Field label="Section heading" className="mb-4">
            <Input value={a.experienceHeading} onChange={(e) => set('experienceHeading', e.target.value)} />
          </Field>
          <SortableList
            items={a.experience.map((v, i) => ({ ...v, __id: `exp-${i}` }))}
            getId={(it) => it.__id}
            onReorder={(next) => setExp(next.map(({ __id, ...rest }) => rest))}
            className="flex flex-col gap-2"
            renderItem={(it, i) => (
              <div className="grid grid-cols-[1fr_2fr_auto] gap-2 items-end">
                <Field label="Years"><Input value={it.y} onChange={(e) => {
                  const next = [...a.experience]; next[i] = { ...a.experience[i], y: e.target.value }; setExp(next)
                }} /></Field>
                <Field label="Role"><Input value={it.r} onChange={(e) => {
                  const next = [...a.experience]; next[i] = { ...a.experience[i], r: e.target.value }; setExp(next)
                }} /></Field>
                <Button variant="ghost" size="icon" onClick={() => setExp(a.experience.filter((_, j) => j !== i))}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            )}
          />
          <Button
            variant="secondary"
            size="sm"
            className="mt-3 self-start"
            onClick={() => setExp([...a.experience, { y: '2020 — now', r: 'Role' }])}
          >
            <Plus className="h-3.5 w-3.5" /> Add experience
          </Button>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Selected clients</CardTitle>
            <CardDescription>Comma-separated list, one per line or use add button.</CardDescription>
          </CardHeader>
          <Field label="Eyebrow" className="mb-4">
            <Input value={a.clientsEyebrow} onChange={(e) => set('clientsEyebrow', e.target.value)} />
          </Field>
          <div className="flex flex-col gap-2">
            {a.clients.map((c, i) => (
              <div key={i} className="flex items-center gap-2">
                <Input value={c} onChange={(e) => {
                  const next = [...a.clients]; next[i] = e.target.value; setClients(next)
                }} />
                <Button variant="ghost" size="icon" onClick={() => setClients(a.clients.filter((_, j) => j !== i))}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
            <Button variant="secondary" size="sm" className="self-start" onClick={() => setClients([...a.clients, 'New Client'])}>
              <Plus className="h-3.5 w-3.5" /> Add client
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
