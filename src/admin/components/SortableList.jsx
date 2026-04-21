import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'

function SortableItem({ id, children, className }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.55 : 1,
  }
  return (
    <div ref={setNodeRef} style={style} className={className}>
      <div className="flex items-stretch gap-2">
        <button
          type="button"
          className="mt-1 flex h-10 w-10 cursor-grab items-center justify-center rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-panel-muted)] text-[var(--admin-subtle)] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition-[background-color,color,border-color,transform] duration-200 hover:border-[var(--admin-border-strong)] hover:bg-[var(--admin-panel)] hover:text-white active:scale-[0.96] active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </button>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  )
}

/**
 * Sortable list. `items` is an array; `getId` returns a stable id per item.
 * `onReorder` receives the new array.
 */
export default function SortableList({
  items,
  getId,
  onReorder,
  renderItem,
  className,
  itemClassName,
}) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }))
  const ids = items.map(getId)

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = ids.indexOf(active.id)
    const newIndex = ids.indexOf(over.id)
    onReorder(arrayMove(items, oldIndex, newIndex))
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        <div className={className}>
          {items.map((item, i) => (
            <SortableItem key={getId(item)} id={getId(item)} className={itemClassName}>
              {renderItem(item, i)}
            </SortableItem>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}
