import { useContent } from '../../context/ContentContext.jsx'
import PageHeader from '../components/PageHeader.jsx'
import { Card, CardHeader, CardTitle, CardDescription, Field, Input, Textarea, Button } from '../components/ui.jsx'
import { Plus, Trash2 } from 'lucide-react'

export default function SitePage() {
  const { content, update } = useContent()
  const site = content.site

  const setField = (k, v) => update(['site', k], v)

  const updateSocials = (next) => update(['site', 'socials'], next)

  return (
    <div>
      <PageHeader eyebrow="Global" title="Site settings" description="Your name, brand, contact details and socials." />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Identity</CardTitle>
            <CardDescription>How you introduce yourself.</CardDescription>
          </CardHeader>
          <div className="flex flex-col gap-4">
            <Field label="Name"><Input value={site.name} onChange={(e) => setField('name', e.target.value)} /></Field>
            <Field label="Role / tagline"><Input value={site.role} onChange={(e) => setField('role', e.target.value)} /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Brand mark"><Input value={site.brandMark} onChange={(e) => setField('brandMark', e.target.value)} /></Field>
              <Field label="Brand full name"><Input value={site.brandFull} onChange={(e) => setField('brandFull', e.target.value)} /></Field>
            </div>
            <Field label="Folio label (nav meta)"><Input value={site.tagline} onChange={(e) => setField('tagline', e.target.value)} /></Field>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Location & time</CardTitle>
            <CardDescription>Shown in nav and footer.</CardDescription>
          </CardHeader>
          <div className="flex flex-col gap-4">
            <Field label="Location"><Input value={site.location} onChange={(e) => setField('location', e.target.value)} /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Timezone" hint="IANA zone, e.g. Europe/Copenhagen">
                <Input value={site.timezone} onChange={(e) => setField('timezone', e.target.value)} />
              </Field>
              <Field label="Short label"><Input value={site.timezoneLabel} onChange={(e) => setField('timezoneLabel', e.target.value)} /></Field>
            </div>
            <Field label="Studio address"><Input value={site.studio} onChange={(e) => setField('studio', e.target.value)} /></Field>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact</CardTitle>
            <CardDescription>Shown in the menu, footer and contact page.</CardDescription>
          </CardHeader>
          <div className="flex flex-col gap-4">
            <Field label="Email"><Input value={site.email} onChange={(e) => setField('email', e.target.value)} /></Field>
            <Field label="Phone"><Input value={site.phone} onChange={(e) => setField('phone', e.target.value)} /></Field>
            <Field label="Availability message"><Input value={site.availability} onChange={(e) => setField('availability', e.target.value)} /></Field>
            <Field label="Slots left"><Input value={site.slotsLeft} onChange={(e) => setField('slotsLeft', e.target.value)} /></Field>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Socials</CardTitle>
            <CardDescription>Links shown in the menu and footer.</CardDescription>
          </CardHeader>
          <div className="flex flex-col gap-3">
            {site.socials.map((s, i) => (
              <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-2">
                <Input
                  placeholder="Label"
                  value={s.label}
                  onChange={(e) => {
                    const next = [...site.socials]
                    next[i] = { ...next[i], label: e.target.value }
                    updateSocials(next)
                  }}
                />
                <Input
                  placeholder="https://…"
                  value={s.url}
                  onChange={(e) => {
                    const next = [...site.socials]
                    next[i] = { ...next[i], url: e.target.value }
                    updateSocials(next)
                  }}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => updateSocials(site.socials.filter((_, j) => j !== i))}
                  title="Remove"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
            <Button
              variant="secondary"
              size="sm"
              className="self-start"
              onClick={() => updateSocials([...site.socials, { label: 'New link ↗', url: '#' }])}
            >
              <Plus className="h-3.5 w-3.5" /> Add social
            </Button>
          </div>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Fine print</CardTitle>
            <CardDescription>Colophon, copyright, version.</CardDescription>
          </CardHeader>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Colophon">
              <Textarea autoGrow value={site.colophon} onChange={(e) => setField('colophon', e.target.value)} />
            </Field>
            <div className="grid gap-4">
              <Field label="Copyright"><Input value={site.copyright} onChange={(e) => setField('copyright', e.target.value)} /></Field>
              <Field label="Rights notice"><Input value={site.rights} onChange={(e) => setField('rights', e.target.value)} /></Field>
              <Field label="Version"><Input value={site.version} onChange={(e) => setField('version', e.target.value)} /></Field>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
