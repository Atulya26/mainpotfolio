import { Dialog, DialogHeader } from './ui.jsx'
import { BLOCK_LABELS, BLOCK_DESCRIPTIONS, ALL_BLOCK_TYPES } from '../../lib/blocks.js'
import {
  Heading2, Type, Columns2, Quote, Image as ImageIcon, ImagePlus,
  Images, BarChart3, Workflow, Info, Film, Minus,
} from 'lucide-react'

const ICONS = {
  heading: Heading2,
  paragraph: Type,
  twoColumn: Columns2,
  pullQuote: Quote,
  image: ImageIcon,
  imagePair: ImagePlus,
  imageGallery: Images,
  stats: BarChart3,
  processCards: Workflow,
  callout: Info,
  videoEmbed: Film,
  divider: Minus,
}

export default function BlockPicker({ open, onOpenChange, onPick }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader onClose={() => onOpenChange(false)}>
        <h2 className="text-lg font-medium text-white">Insert block</h2>
        <p className="mt-1 text-sm leading-6 text-[var(--admin-muted)]">Choose the kind of content you want to add.</p>
      </DialogHeader>

      <div className="grid gap-2 sm:grid-cols-2">
        {ALL_BLOCK_TYPES.map((type) => {
          const Icon = ICONS[type]
          return (
            <button
              key={type}
              onClick={() => {
                onPick(type)
                onOpenChange(false)
              }}
              className="group flex flex-col gap-3 rounded-[22px] border border-[var(--admin-border)] bg-[var(--admin-panel-muted)] p-4 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition-[background-color,border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-[var(--admin-border-strong)] hover:bg-[var(--admin-panel)]"
            >
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[var(--admin-border)] bg-white/[0.05] text-white transition-colors group-hover:border-transparent group-hover:bg-[var(--admin-accent)]">
                  <Icon className="h-4 w-4" />
                </div>
                <p className="text-sm font-medium tracking-[-0.02em] text-white">{BLOCK_LABELS[type]}</p>
              </div>
              <p className="text-xs leading-6 text-[var(--admin-muted)]">{BLOCK_DESCRIPTIONS[type]}</p>
            </button>
          )
        })}
      </div>
    </Dialog>
  )
}
