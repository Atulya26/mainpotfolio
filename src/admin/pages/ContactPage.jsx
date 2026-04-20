import { useContent } from '../../context/ContentContext.jsx'
import PageHeader from '../components/PageHeader.jsx'
import { Card, CardHeader, CardTitle, Field, Input, Textarea } from '../components/ui.jsx'

export default function ContactPage() {
  const { content, update } = useContent()
  const c = content.contact

  const set = (k, v) => update(['contact', k], v)
  const setArr = (k, v) => update(['contact', k], v)

  return (
    <div>
      <PageHeader eyebrow="Pages" title="Contact page" description="/contact — copy and form labels." />

      <div className="grid gap-6">
        <Card>
          <CardHeader><CardTitle>Header</CardTitle></CardHeader>
          <div className="flex flex-col gap-4">
            <Field label="Eyebrow"><Input value={c.eyebrow} onChange={(e) => set('eyebrow', e.target.value)} /></Field>
            <Field label="Heading"><Textarea rows={2} autoGrow value={c.heading} onChange={(e) => set('heading', e.target.value)} /></Field>
          </div>
        </Card>

        <Card>
          <CardHeader><CardTitle>Form fields</CardTitle></CardHeader>
          <div className="grid gap-4 md:grid-cols-2">
            {c.formLabels.map((_, i) => (
              <div key={i} className="flex flex-col gap-3">
                <Field label={`Field ${i + 1} label`}>
                  <Input value={c.formLabels[i]} onChange={(e) => {
                    const next = [...c.formLabels]; next[i] = e.target.value; setArr('formLabels', next)
                  }} />
                </Field>
                <Field label={`Field ${i + 1} placeholder`}>
                  <Input value={c.placeholders[i]} onChange={(e) => {
                    const next = [...c.placeholders]; next[i] = e.target.value; setArr('placeholders', next)
                  }} />
                </Field>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <Field label="Submit button label"><Input value={c.submitLabel} onChange={(e) => set('submitLabel', e.target.value)} /></Field>
          </div>
        </Card>

        <Card>
          <CardHeader><CardTitle>Aside</CardTitle></CardHeader>
          <div className="grid gap-4 md:grid-cols-3">
            <Field label="Direct eyebrow"><Input value={c.directEyebrow} onChange={(e) => set('directEyebrow', e.target.value)} /></Field>
            <Field label="Calendar eyebrow"><Input value={c.calendarEyebrow} onChange={(e) => set('calendarEyebrow', e.target.value)} /></Field>
            <Field label="Calendar label"><Input value={c.calendarLabel} onChange={(e) => set('calendarLabel', e.target.value)} /></Field>
            <Field label="Office eyebrow"><Input value={c.officeEyebrow} onChange={(e) => set('officeEyebrow', e.target.value)} /></Field>
          </div>
        </Card>
      </div>
    </div>
  )
}
