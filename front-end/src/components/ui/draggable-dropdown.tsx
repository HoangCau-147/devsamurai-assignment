"use client"

import * as React from "react"
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  rectSortingStrategy,
  useSortable,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical, ChevronDown } from "lucide-react"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"

import { cn } from "@/lib/utils"

export type DraggableItem = {
  id: string
  name: string
  icon?: React.ElementType | null
}

type Props = {
  items: DraggableItem[]
  title?: string
  triggerLabel?: string
  onOrderChange?: (items: DraggableItem[]) => void
}

function SortableItem({ item }: { item: DraggableItem }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id })

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
  }

  const Icon = item.icon

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={cn(
        "group flex items-center gap-3 rounded-md px-2 py-2 bg-transparent text-popover-foreground w-full",
        "border border-transparent hover:border-border"
      )}
    >
      <button
        aria-label={`Drag ${item.name}`}
        type="button"
        className="hidden group-hover:inline-flex items-center justify-center rounded text-muted-foreground hover:text-foreground"
        {...listeners}
        {...attributes}
      >
        <GripVertical className="size-3" />
      </button>

      <div className="h-6 w-6 rounded-md bg-gray-100 flex items-center justify-center">
        {Icon ? (
          <Icon className="size-4 text-muted-foreground" />
        ) : (
          <div className="h-3 w-3 rounded-full bg-muted" />
        )}
      </div>
      <div className="flex-1 text-sm font-medium truncate">{item.name}</div>
    </li>
  );
}

export function DraggableDropdown({ items: initialItems, title = "Favorites", triggerLabel = "Favorites", onOrderChange }: Props) {
  const [items, setItems] = React.useState<DraggableItem[]>(initialItems)

  React.useEffect(() => {
    setItems(initialItems)
  }, [initialItems])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over) return
    if (active.id !== over.id) {
      const oldIndex = items.findIndex((i) => i.id === active.id)
      const newIndex = items.findIndex((i) => i.id === over.id)
      const newItems = arrayMove(items, oldIndex, newIndex)
      setItems(newItems)
      onOrderChange?.(newItems)
    }
  }

  const [open, setOpen] = React.useState(true)
  const panelRef = React.useRef<HTMLDivElement | null>(null)
  const triggerRef = React.useRef<HTMLButtonElement | null>(null)

  React.useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!open) return
      const target = e.target as Node
      if (panelRef.current && !panelRef.current.contains(target) && triggerRef.current && !triggerRef.current.contains(target)) {
        setOpen(false)
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("mousedown", onDoc)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("mousedown", onDoc)
      document.removeEventListener("keydown", onKey)
    }
  }, [open])

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        aria-expanded={open}
        aria-controls={`${title}-panel`}
        onClick={() => setOpen((v) => !v)}
        className="group inline-flex w-full items-center justify-between rounded-md px-2 py-3 text-sm font-medium hover:bg-accent"
      >
        <span>{triggerLabel}</span>
        <ChevronDown className={`hidden group-hover:inline-block ml-2 size-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      <div
        id={`${title}-panel`}
        ref={panelRef}
        className={`${open ? "block" : "hidden"} mt-2 w-64 rounded-md bg-transparent`}
        role="region"
      >
        <DndContext sensors={sensors} modifiers={[restrictToVerticalAxis]} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={items.map((i) => i.id)} strategy={rectSortingStrategy}>
            <ul role="list" className="flex flex-col">
              {items.map((it) => (
                <SortableItem key={it.id} item={it} />
              ))}
            </ul>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  )
}

export default DraggableDropdown
