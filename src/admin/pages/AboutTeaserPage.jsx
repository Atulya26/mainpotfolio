import { useContent } from '../../context/ContentContext.jsx'
import PageHeader from '../components/PageHeader.jsx'
import { Card, CardHeader, CardTitle, Field, Input, Textarea } from '../components/ui.jsx'

export default function AboutTeaserPage() {
  const { content, update } = useContent()
  const t = content.aboutTeaser

  const set = (k, v) => update(['aboutTeaser', k], v)

  return (
    <div>
      <PageHeader eyebrow="Home" title="About teaser" description="The short bio block between Capabilities and Footer." />

      <Card>
        <CardHeader>
          <CardTitle>Copy</CardTitle>
        </CardHeader>
        <div className="flex flex-col gap-4">
          <Field label="Eyebrow"><Input value={t.eyebrow} onChange={(e) => set('eyebrow', e.target.value)} /></Field>
          <Field label="Heading">
            <Textarea rows={3} autoGrow value={t.heading} onChange={(e) => set('heading', e.target.value)} />
          </Field>
          <Field label="Subtext">
            <Textarea rows={3} autoGrow value={t.sub} onChange={(e) => set('sub', e.target.value)} />
          </Field>
          <Field label="CTA label"><Input value={t.ctaLabel} onChange={(e) => set('ctaLabel', e.target.value)} /></Field>
        </div>
      </Card>
    </div>
  )
}
