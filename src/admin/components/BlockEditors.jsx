// Per-block-type inline editors. Each receives (block, onChange) where
// onChange(patch) merges the patch into the block.

import { Input, Textarea, Label, Field, Select, Button } from './ui.jsx'
import ImageInput from './ImageInput.jsx'
import { Plus, Trash2 } from 'lucide-react'

export function HeadingEditor({ block, onChange }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-[1fr_140px_140px] gap-2">
        <Field label="Text">
          <Input value={block.text} onChange={(e) => onChange({ text: e.target.value })} />
        </Field>
        <Field label="Level">
          <Select
            value={String(block.level || 2)}
            onChange={(v) => onChange({ level: Number(v) })}
            options={[
              { value: '2', label: 'H2 (large)' },
              { value: '3', label: 'H3 (medium)' },
            ]}
          />
        </Field>
        <Field label="Style">
          <Select
            value={block.style || 'sans'}
            onChange={(v) => onChange({ style: v })}
            options={[
              { value: 'sans', label: 'Sans' },
              { value: 'serif', label: 'Serif italic' },
            ]}
          />
        </Field>
      </div>
    </div>
  )
}

export function ParagraphEditor({ block, onChange }) {
  return (
    <div className="flex flex-col gap-3">
      <Field label="Variant">
        <Select
          value={block.variant || 'body'}
          onChange={(v) => onChange({ variant: v })}
          options={[
            { value: 'body', label: 'Body (default)' },
            { value: 'lede', label: 'Lede (larger)' },
          ]}
        />
      </Field>
      <Field label="Text">
        <Textarea rows={4} autoGrow value={block.text} onChange={(e) => onChange({ text: e.target.value })} />
      </Field>
    </div>
  )
}

export function TwoColumnEditor({ block, onChange }) {
  return (
    <div className="grid gap-3 md:grid-cols-[200px_1fr]">
      <Field label="Label (left column)">
        <Input value={block.label} onChange={(e) => onChange({ label: e.target.value })} />
      </Field>
      <Field label="Body (right column)" hint="Double line-break separates paragraphs.">
        <Textarea rows={4} autoGrow value={block.body} onChange={(e) => onChange({ body: e.target.value })} />
      </Field>
    </div>
  )
}

export function PullQuoteEditor({ block, onChange }) {
  return (
    <div className="flex flex-col gap-3">
      <Field label="Quote">
        <Textarea rows={3} autoGrow value={block.text} onChange={(e) => onChange({ text: e.target.value })} />
      </Field>
      <Field label="Attribution">
        <Input value={block.author} onChange={(e) => onChange({ author: e.target.value })} />
      </Field>
    </div>
  )
}

export function ImageEditor({ block, onChange }) {
  return (
    <div className="grid gap-3 md:grid-cols-[1fr_260px]">
      <div className="flex flex-col gap-3">
        <Field label="Image source">
          <ImageInput value={block.src} onChange={(v) => onChange({ src: v })} />
        </Field>
      </div>
      <div className="flex flex-col gap-3">
        <Field label="Layout">
          <Select
            value={block.layout || 'full'}
            onChange={(v) => onChange({ layout: v })}
            options={[
              { value: 'full', label: 'Full-bleed' },
              { value: 'inset', label: 'Inset (padded)' },
            ]}
          />
        </Field>
        <Field label="Alt text" hint="For screen readers.">
          <Input value={block.alt || ''} onChange={(e) => onChange({ alt: e.target.value })} />
        </Field>
        <Field label="Caption" hint="Shown below the image in mono.">
          <Input value={block.caption || ''} onChange={(e) => onChange({ caption: e.target.value })} />
        </Field>
      </div>
    </div>
  )
}

export function ImagePairEditor({ block, onChange }) {
  const setLeft = (patch) => onChange({ left: { ...block.left, ...patch } })
  const setRight = (patch) => onChange({ right: { ...block.right, ...patch } })
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {[
        { title: 'Left figure', fig: block.left, set: setLeft },
        { title: 'Right figure', fig: block.right, set: setRight },
      ].map((side, i) => (
        <div key={i} className="rounded-md border border-white/5 p-3 flex flex-col gap-3">
          <Label>{side.title}</Label>
          <ImageInput value={side.fig?.src} onChange={(v) => side.set({ src: v })} aspect="4/5" />
          <Input
            placeholder="Caption"
            value={side.fig?.caption || ''}
            onChange={(e) => side.set({ caption: e.target.value })}
          />
        </div>
      ))}
    </div>
  )
}

export function ImageGalleryEditor({ block, onChange }) {
  const items = block.items || []
  const setItems = (next) => onChange({ items: next })
  return (
    <div className="flex flex-col gap-3">
      <Field label="Columns">
        <Select
          value={String(block.columns || 3)}
          onChange={(v) => onChange({ columns: Number(v) })}
          options={[
            { value: '2', label: '2 columns' },
            { value: '3', label: '3 columns' },
            { value: '4', label: '4 columns' },
          ]}
        />
      </Field>
      <div className="grid gap-3 md:grid-cols-3">
        {items.map((it, i) => (
          <div key={i} className="rounded-md border border-white/5 p-3 flex flex-col gap-2">
            <ImageInput
              value={it.src}
              aspect="4/5"
              onChange={(v) => {
                const next = [...items]
                next[i] = { ...it, src: v }
                setItems(next)
              }}
            />
            <Input
              placeholder="Caption"
              value={it.caption || ''}
              onChange={(e) => {
                const next = [...items]
                next[i] = { ...it, caption: e.target.value }
                setItems(next)
              }}
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setItems(items.filter((_, j) => j !== i))}
            >
              <Trash2 className="h-3 w-3" /> Remove
            </Button>
          </div>
        ))}
      </div>
      <Button variant="secondary" size="sm" className="self-start" onClick={() => setItems([...items, { src: '', caption: '' }])}>
        <Plus className="h-3.5 w-3.5" /> Add image
      </Button>
    </div>
  )
}

export function StatsEditor({ block, onChange }) {
  const items = block.items || []
  const setItems = (next) => onChange({ items: next })
  return (
    <div className="flex flex-col gap-3">
      {items.map((it, i) => (
        <div key={i} className="grid grid-cols-[1fr_2fr_auto] gap-2 items-end">
          <Field label="Value"><Input value={it.v} onChange={(e) => {
            const next = [...items]; next[i] = { ...it, v: e.target.value }; setItems(next)
          }} /></Field>
          <Field label="Label"><Input value={it.l} onChange={(e) => {
            const next = [...items]; next[i] = { ...it, l: e.target.value }; setItems(next)
          }} /></Field>
          <Button variant="ghost" size="icon" onClick={() => setItems(items.filter((_, j) => j !== i))}>
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      ))}
      <Button variant="secondary" size="sm" className="self-start" onClick={() => setItems([...items, { v: '+10%', l: 'New metric' }])}>
        <Plus className="h-3.5 w-3.5" /> Add stat
      </Button>
    </div>
  )
}

export function FactGridEditor({ block, onChange }) {
  const items = block.items || []
  const setItems = (next) => onChange({ items: next })
  return (
    <div className="flex flex-col gap-3">
      <Field label="Eyebrow">
        <Input value={block.eyebrow || ''} onChange={(e) => onChange({ eyebrow: e.target.value })} />
      </Field>
      {items.map((item, i) => (
        <div key={i} className="grid grid-cols-[1fr_2fr_auto] gap-2 items-end">
          <Field label="Label">
            <Input value={item.label || ''} onChange={(e) => {
              const next = [...items]
              next[i] = { ...item, label: e.target.value }
              setItems(next)
            }} />
          </Field>
          <Field label="Value">
            <Textarea rows={2} autoGrow value={item.value || ''} onChange={(e) => {
              const next = [...items]
              next[i] = { ...item, value: e.target.value }
              setItems(next)
            }} />
          </Field>
          <Button variant="ghost" size="icon" onClick={() => setItems(items.filter((_, j) => j !== i))}>
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      ))}
      <Button variant="secondary" size="sm" className="self-start" onClick={() => setItems([...items, { label: 'New fact', value: 'Short description' }])}>
        <Plus className="h-3.5 w-3.5" /> Add fact
      </Button>
    </div>
  )
}

export function BulletListEditor({ block, onChange }) {
  const items = block.items || []
  const setItems = (next) => onChange({ items: next })
  return (
    <div className="flex flex-col gap-3">
      <div className="grid gap-3 md:grid-cols-[180px_1fr]">
        <Field label="Eyebrow">
          <Input value={block.eyebrow || ''} onChange={(e) => onChange({ eyebrow: e.target.value })} />
        </Field>
        <Field label="Heading">
          <Input value={block.heading || ''} onChange={(e) => onChange({ heading: e.target.value })} />
        </Field>
      </div>
      {items.map((item, i) => (
        <div key={i} className="grid grid-cols-[auto_1fr_auto] gap-2 items-start">
          <span className="mono-font mt-3 text-[10px] uppercase tracking-[0.12em] text-[var(--admin-subtle)]">{String(i + 1).padStart(2, '0')}</span>
          <Field label="Item">
            <Textarea rows={2} autoGrow value={item} onChange={(e) => {
              const next = [...items]
              next[i] = e.target.value
              setItems(next)
            }} />
          </Field>
          <Button variant="ghost" size="icon" className="mt-6" onClick={() => setItems(items.filter((_, j) => j !== i))}>
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      ))}
      <Button variant="secondary" size="sm" className="self-start" onClick={() => setItems([...items, 'New list item'])}>
        <Plus className="h-3.5 w-3.5" /> Add item
      </Button>
    </div>
  )
}

export function TimelineEditor({ block, onChange }) {
  const items = block.items || []
  const setItems = (next) => onChange({ items: next })
  return (
    <div className="flex flex-col gap-3">
      <Field label="Eyebrow">
        <Input value={block.eyebrow || ''} onChange={(e) => onChange({ eyebrow: e.target.value })} />
      </Field>
      {items.map((item, i) => (
        <div key={i} className="grid grid-cols-[180px_1fr_auto] gap-2 items-start">
          <Field label="Step / phase">
            <Input value={item.k || ''} onChange={(e) => {
              const next = [...items]
              next[i] = { ...item, k: e.target.value }
              setItems(next)
            }} />
          </Field>
          <Field label="Description">
            <Textarea rows={2} autoGrow value={item.v || ''} onChange={(e) => {
              const next = [...items]
              next[i] = { ...item, v: e.target.value }
              setItems(next)
            }} />
          </Field>
          <Button variant="ghost" size="icon" className="mt-6" onClick={() => setItems(items.filter((_, j) => j !== i))}>
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      ))}
      <Button variant="secondary" size="sm" className="self-start" onClick={() => setItems([...items, { k: '04 / Launch', v: 'What happened in this phase.' }])}>
        <Plus className="h-3.5 w-3.5" /> Add row
      </Button>
    </div>
  )
}

export function ProcessCardsEditor({ block, onChange }) {
  const cards = block.cards || []
  const setCards = (next) => onChange({ cards: next })
  return (
    <div className="flex flex-col gap-3">
      <div className="grid gap-3 md:grid-cols-[160px_1fr]">
        <Field label="Eyebrow"><Input value={block.eyebrow} onChange={(e) => onChange({ eyebrow: e.target.value })} /></Field>
        <Field label="Heading"><Input value={block.heading} onChange={(e) => onChange({ heading: e.target.value })} /></Field>
      </div>
      <div className="flex flex-col gap-2 mt-2">
        {cards.map((c, i) => (
          <div key={i} className="grid grid-cols-[1fr_2fr_auto] gap-2 items-start">
            <Field label="Step">
              <Input value={c.k} onChange={(e) => {
                const next = [...cards]; next[i] = { ...c, k: e.target.value }; setCards(next)
              }} />
            </Field>
            <Field label="Description">
              <Textarea rows={2} autoGrow value={c.v} onChange={(e) => {
                const next = [...cards]; next[i] = { ...c, v: e.target.value }; setCards(next)
              }} />
            </Field>
            <Button variant="ghost" size="icon" className="mt-6" onClick={() => setCards(cards.filter((_, j) => j !== i))}>
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        ))}
        <Button variant="secondary" size="sm" className="self-start" onClick={() => setCards([...cards, { k: 'New step', v: 'Description.' }])}>
          <Plus className="h-3.5 w-3.5" /> Add step
        </Button>
      </div>
    </div>
  )
}

export function CalloutEditor({ block, onChange }) {
  return (
    <div className="flex flex-col gap-3">
      <Field label="Tag / small label"><Input value={block.title} onChange={(e) => onChange({ title: e.target.value })} /></Field>
      <Field label="Body"><Textarea rows={3} autoGrow value={block.body} onChange={(e) => onChange({ body: e.target.value })} /></Field>
    </div>
  )
}

export function VideoEmbedEditor({ block, onChange }) {
  return (
    <div className="flex flex-col gap-3">
      <Field label="Video URL" hint="YouTube, Vimeo, or direct .mp4 / .webm">
        <Input value={block.url} onChange={(e) => onChange({ url: e.target.value })} placeholder="https://…" />
      </Field>
      <Field label="Caption"><Input value={block.caption || ''} onChange={(e) => onChange({ caption: e.target.value })} /></Field>
    </div>
  )
}

export function DividerEditor() {
  return (
    <p className="text-xs text-white/40 italic">A thin rule + breathing room. No options.</p>
  )
}

export const EDITORS = {
  heading: HeadingEditor,
  paragraph: ParagraphEditor,
  twoColumn: TwoColumnEditor,
  pullQuote: PullQuoteEditor,
  image: ImageEditor,
  imagePair: ImagePairEditor,
  imageGallery: ImageGalleryEditor,
  stats: StatsEditor,
  factGrid: FactGridEditor,
  bulletList: BulletListEditor,
  timeline: TimelineEditor,
  processCards: ProcessCardsEditor,
  callout: CalloutEditor,
  videoEmbed: VideoEmbedEditor,
  divider: DividerEditor,
}
