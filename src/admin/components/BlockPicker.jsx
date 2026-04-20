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
        <p className="text-sm text-white/50 mt-1">Choose the kind of content you want to add.</p>
      </DialogHeader>

      <div className="grid grid-cols-2 gap-2">
        {ALL_BLOCK_TYPES.map((type) => {
          const Icon = ICONS[type]
          return (
            <button
              key={type}
              onClick={() => {
                onPick(type)
                onOpenChange(false)
              }}
              className="group flex flex-col gap-2 rounded-lg border border-white/10 bg-white/[0.02] p-3 text-left transition-colors hover:border-white/20 hover:bg-white/[0.06]"
            >
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white/10 text-white group-hover:bg-[#ff4a1c] group-hover:text-white">
                  <Icon className="h-4 w-4" />
                </div>
                <p className="text-sm font-medium text-white">{BLOCK_LABELS[type]}</p>
              </div>
              <p className="text-xs text-white/50 leading-relaxed">{BLOCK_DESCRIPTIONS[type]}</p>
            </button>
          )
        })}
      </div>
    </Dialog>
  )
}
