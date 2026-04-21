import { useState } from 'react'
import {
  DndContext, closestCenter, PointerSensor, useSensor, useSensors,
} from '@dnd-kit/core'
import {
  SortableContext, verticalListSortingStrategy, useSortable, arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Plus, Trash2, Copy, ChevronDown, ChevronRight } from 'lucide-react'
import {
  Heading2, Type, Columns2, Quote, Image as ImageIcon, ImagePlus,
  Images, BarChart3, Workflow, Info, Film, Minus,
} from 'lucide-react'
import { Button } from './ui.jsx'
import { BLOCK_LABELS, makeBlock } from '../../lib/blocks.js'
import { EDITORS } from './BlockEditors.jsx'
import BlockPicker from './BlockPicker.jsx'

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

function duplicateId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID().slice(0, 8)
  return `copy-${Date.now().toString(36)}`
}

// A compact preview summary shown in the block header when collapsed.
function previewFor(block) {
  switch (block.type) {
    case 'heading': return block.text
    case 'paragraph': return block.text
    case 'twoColumn': return `${block.label} — ${block.body?.slice(0, 60)}…`
    case 'pullQuote': return `"${block.text?.slice(0, 70)}…"`
    case 'image': return block.caption || block.src?.split('/').pop() || 'No source'
    case 'imagePair': return 'Two figures'
    case 'imageGallery': return `${(block.items || []).filter((i) => i.src).length} images`
    case 'stats': return (block.items || []).map((s) => s.v).join(' · ')
    case 'processCards': return `${block.heading || ''} (${(block.cards || []).length} steps)`
    case 'callout': return block.title
    case 'videoEmbed': return block.url || 'No URL yet'
    case 'divider': return '—'
    default: return ''
  }
}

function BlockCard({ block, onChange, onDelete, onDuplicate }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: block.id })
  const [open, setOpen] = useState(true)
  const Icon = ICONS[block.type] || Type
  const Editor = EDITORS[block.type]
  const preview = previewFor(block)

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 10 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="overflow-hidden rounded-[24px] border border-[var(--admin-border)] bg-[var(--admin-panel)] shadow-[var(--admin-shadow)]"
    >
      <div className="flex items-center gap-2 border-b border-[var(--admin-border)] px-3 py-2">
        <button
          {...attributes}
          {...listeners}
          className="flex h-9 w-9 cursor-grab items-center justify-center rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-panel-muted)] text-[var(--admin-subtle)] transition-[background-color,color,border-color,transform] duration-200 hover:border-[var(--admin-border-strong)] hover:bg-[var(--admin-panel-strong)] hover:text-white active:scale-[0.96] active:cursor-grabbing"
          title="Drag"
        >
          <GripVertical className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 w-9 items-center justify-center rounded-2xl border border-transparent text-[var(--admin-subtle)] transition-[background-color,color,border-color,transform] duration-200 hover:border-[var(--admin-border)] hover:bg-[var(--admin-panel-muted)] hover:text-white active:scale-[0.96]"
          title={open ? 'Collapse' : 'Expand'}
        >
          {open ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
        </button>

        <div className="flex items-center gap-2 min-w-0 flex-1">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl border border-[var(--admin-border)] bg-white/[0.04]">
            <Icon className="h-3.5 w-3.5 text-[var(--admin-muted)]" />
          </span>
          <span className="mono-font shrink-0 text-[10px] uppercase tracking-[0.12em] text-[var(--admin-subtle)]">
            {BLOCK_LABELS[block.type]}
          </span>
          {!open && preview && (
            <span className="truncate text-sm text-[var(--admin-muted)]">{preview}</span>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            className="flex h-9 w-9 items-center justify-center rounded-2xl text-[var(--admin-subtle)] transition-colors hover:bg-white/6 hover:text-white"
            onClick={onDuplicate}
            title="Duplicate"
          >
            <Copy className="h-3.5 w-3.5" />
          </button>
          <button
            className="flex h-9 w-9 items-center justify-center rounded-2xl text-red-400/70 transition-colors hover:bg-red-500/10 hover:text-red-400"
            onClick={onDelete}
            title="Delete"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {open && (
        <div className="p-5">
          {Editor ? <Editor block={block} onChange={onChange} /> : <p className="text-xs text-[var(--admin-subtle)]">No editor.</p>}
        </div>
      )}
    </div>
  )
}

function InsertRail({ onPick }) {
  return (
    <div className="relative my-1 flex h-10 items-center justify-center">
      <div className="pointer-events-none absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-[var(--admin-border)] to-transparent" />
      <button
        onClick={onPick}
        className="relative z-10 inline-flex items-center gap-1 rounded-full border border-[var(--admin-border)] bg-[rgba(12,14,18,0.96)] px-3 py-1.5 text-[10px] uppercase tracking-[0.12em] text-[var(--admin-muted)] shadow-[var(--admin-shadow)] transition-[background-color,color,border-color,transform] duration-200 hover:border-[var(--admin-border-strong)] hover:bg-[var(--admin-panel)] hover:text-white active:scale-[0.96] mono-font"
      >
        <Plus className="h-3 w-3" /> Add block
      </button>
    </div>
  )
}

export default function BlockEditor({ blocks, onChange }) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }))
  const [pickerOpen, setPickerOpen] = useState(false)
  const [insertAt, setInsertAt] = useState(null) // null = append, number = index after which to insert

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = blocks.findIndex((b) => b.id === active.id)
    const newIndex = blocks.findIndex((b) => b.id === over.id)
    onChange(arrayMove(blocks, oldIndex, newIndex))
  }

  const updateBlock = (id, patch) => {
    onChange(blocks.map((b) => (b.id === id ? { ...b, ...patch } : b)))
  }

  const deleteBlock = (id) => {
    if (confirm('Delete this block?')) {
      onChange(blocks.filter((b) => b.id !== id))
    }
  }

  const duplicateBlock = (id) => {
    const idx = blocks.findIndex((b) => b.id === id)
    if (idx < 0) return
    const original = blocks[idx]
    const copy = { ...structuredClone(original), id: duplicateId() }
    const next = [...blocks.slice(0, idx + 1), copy, ...blocks.slice(idx + 1)]
    onChange(next)
  }

  const insertAfter = (indexOrNull, type) => {
    const block = makeBlock(type)
    if (indexOrNull == null) {
      onChange([...blocks, block])
    } else {
      onChange([...blocks.slice(0, indexOrNull + 1), block, ...blocks.slice(indexOrNull + 1)])
    }
  }

  const openPicker = (indexOrNull) => {
    setInsertAt(indexOrNull)
    setPickerOpen(true)
  }

  return (
    <>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-2">
            {blocks.length === 0 && (
              <div className="rounded-[24px] border border-dashed border-[var(--admin-border)] bg-[var(--admin-panel-muted)] p-12 text-center text-[var(--admin-muted)]">
                <p className="mb-3">No blocks yet — your case study body is empty.</p>
                <Button variant="accent" onClick={() => openPicker(null)}>
                  <Plus className="h-3.5 w-3.5" /> Add your first block
                </Button>
              </div>
            )}

            {blocks.map((b, i) => (
              <div key={b.id} className="flex flex-col">
                {i > 0 && <InsertRail onPick={() => openPicker(i - 1)} />}
                <BlockCard
                  block={b}
                  onChange={(patch) => updateBlock(b.id, patch)}
                  onDelete={() => deleteBlock(b.id)}
                  onDuplicate={() => duplicateBlock(b.id)}
                />
              </div>
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {blocks.length > 0 && (
        <div className="mt-4 flex justify-center">
          <Button variant="secondary" onClick={() => openPicker(null)}>
            <Plus className="h-3.5 w-3.5" /> Add block
          </Button>
        </div>
      )}

      <BlockPicker
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        onPick={(type) => insertAfter(insertAt, type)}
      />
    </>
  )
}
