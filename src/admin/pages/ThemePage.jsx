import { useContent } from '../../context/ContentContext.jsx'
import PageHeader from '../components/PageHeader.jsx'
import { Card, CardHeader, CardTitle, CardDescription, Field, Input } from '../components/ui.jsx'
import ColorInput from '../components/ColorInput.jsx'

export default function ThemePage() {
  const { content, update } = useContent()
  const theme = content.theme

  const set = (k, v) => update(['theme', k], v)

  return (
    <div>
      <PageHeader eyebrow="Global" title="Theme & type" description="Palette and typefaces. Changes are live — reload the site tab to see them." />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Light palette</CardTitle>
            <CardDescription>Default colors for the site.</CardDescription>
          </CardHeader>
          <div className="flex flex-col gap-4">
            <Field label="Background"><ColorInput value={theme.bgLight} onChange={(v) => set('bgLight', v)} /></Field>
            <Field label="Background alt"><ColorInput value={theme.bgAltLight} onChange={(v) => set('bgAltLight', v)} /></Field>
            <Field label="Foreground"><ColorInput value={theme.fgLight} onChange={(v) => set('fgLight', v)} /></Field>
            <Field label="Foreground muted"><ColorInput value={theme.fgMutedLight} onChange={(v) => set('fgMutedLight', v)} /></Field>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dark palette</CardTitle>
            <CardDescription>Used when the toggle is on.</CardDescription>
          </CardHeader>
          <div className="flex flex-col gap-4">
            <Field label="Background"><ColorInput value={theme.bgDark} onChange={(v) => set('bgDark', v)} /></Field>
            <Field label="Background alt"><ColorInput value={theme.bgAltDark} onChange={(v) => set('bgAltDark', v)} /></Field>
            <Field label="Foreground"><ColorInput value={theme.fgDark} onChange={(v) => set('fgDark', v)} /></Field>
            <Field label="Foreground muted"><ColorInput value={theme.fgMutedDark} onChange={(v) => set('fgMutedDark', v)} /></Field>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Accent</CardTitle>
            <CardDescription>Highlights, selection, CTAs.</CardDescription>
          </CardHeader>
          <div
            className="h-16 w-full rounded-lg border border-white/10 mb-4"
            style={{ background: theme.accent }}
          />
          <Field label="Accent color"><ColorInput value={theme.accent} onChange={(v) => set('accent', v)} /></Field>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Typography</CardTitle>
            <CardDescription>Font stacks. Must be loaded in index.html.</CardDescription>
          </CardHeader>
          <div className="flex flex-col gap-4">
            <Field label="Display / body" hint="Default sans">
              <Input value={theme.fontDisplay} onChange={(e) => set('fontDisplay', e.target.value)} />
            </Field>
            <Field label="Serif accent" hint="Used for italics and accents">
              <Input value={theme.fontSerif} onChange={(e) => set('fontSerif', e.target.value)} />
            </Field>
            <Field label="Mono" hint="Labels and numbers">
              <Input value={theme.fontMono} onChange={(e) => set('fontMono', e.target.value)} />
            </Field>
          </div>
        </Card>
      </div>
    </div>
  )
}
