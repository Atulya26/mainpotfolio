import { useContent } from '../../context/ContentContext.jsx'
import PageHeader from '../components/PageHeader.jsx'
import { Card, CardHeader, CardTitle, Field, Input, Textarea } from '../components/ui.jsx'

export default function FooterPage() {
  const { content, update } = useContent()
  const f = content.footer

  const set = (k, v) => update(['footer', k], v)

  return (
    <div>
      <PageHeader eyebrow="Pages" title="Footer" description="The big closing block with the hello CTA." />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Top</CardTitle></CardHeader>
          <div className="flex flex-col gap-4">
            <Field label="Eyebrow"><Input value={f.eyebrow} onChange={(e) => set('eyebrow', e.target.value)} /></Field>
            <Field label="Lead paragraph"><Textarea rows={3} autoGrow value={f.lead} onChange={(e) => set('lead', e.target.value)} /></Field>
          </div>
        </Card>

        <Card>
          <CardHeader><CardTitle>Big CTA</CardTitle></CardHeader>
          <div className="flex flex-col gap-4">
            <Field label="Word 1"><Input value={f.bigWord1} onChange={(e) => set('bigWord1', e.target.value)} /></Field>
            <Field label="Word 2 (serif italic)"><Input value={f.bigWord2} onChange={(e) => set('bigWord2', e.target.value)} /></Field>
            <Field label="Arrow / glyph"><Input value={f.bigArrow} onChange={(e) => set('bigArrow', e.target.value)} /></Field>
          </div>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader><CardTitle>Grid labels</CardTitle></CardHeader>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Based label"><Input value={f.basedLabel} onChange={(e) => set('basedLabel', e.target.value)} /></Field>
            <Field label="Based value"><Input value={f.basedValue} onChange={(e) => set('basedValue', e.target.value)} /></Field>
            <Field label="Contact label"><Input value={f.contactLabel} onChange={(e) => set('contactLabel', e.target.value)} /></Field>
            <Field label="Follow label"><Input value={f.followLabel} onChange={(e) => set('followLabel', e.target.value)} /></Field>
            <Field label="Colophon label"><Input value={f.colophonLabel} onChange={(e) => set('colophonLabel', e.target.value)} /></Field>
          </div>
        </Card>
      </div>
    </div>
  )
}
