"use client";

import * as React from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  rectSortingStrategy,
  useSortable,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, ChevronDown, StarOff } from "lucide-react";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { cn } from "@/lib/utils";

import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";

import { useSidebar } from "@/components/ui/sidebar";

export type NavItem = {
  id: string;
  name: string;
  url?: string;
  favicon?: string;
  children?: NavItem[];
};

type Props = {
  items: NavItem[];
  title?: string;
  triggerLabel?: string;
  onOrderChange?: (items: NavItem[]) => void;
};

function SortableNavItem({ item }: { item: NavItem }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
  };

  const hasVisual = !!item.favicon;

  const AvatarIcon = (
    <div className="h-4 w-4 flex shrink-0 items-center justify-center overflow-hidden rounded-sm">
      {item.favicon ? (
        <img
          src={item.favicon}
          alt=""
          className="h-full w-full object-contain"
          onError={(e) => {
            e.currentTarget.style.display = "none";
            e.currentTarget.nextElementSibling?.classList.remove("hidden");
          }}
        />
      ) : null}

      <span
        className={cn(
          "text-xs font-semibold text-muted-foreground",
          hasVisual && "hidden"
        )}
      >
        {item.name.charAt(0).toUpperCase()}
      </span>
    </div>
  );

  if (item.children && item.children.length > 0) {
    return (
      <li ref={setNodeRef} style={style} className="relative group/li">
        <Collapsible asChild>
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton tooltip={item.name} className="w-full">
                <button
                  aria-label={`Drag ${item.name}`}
                  type="button"
                  className="absolute left-0 top-1/2 hidden group-hover/li:inline-flex items-center justify-center rounded text-muted-foreground hover:text-foreground z-10"
                  {...listeners}
                  {...attributes}
                >
                  <GripVertical className="size-2.5" />
                </button>

                <div className="flex items-center w-full">
                  {AvatarIcon}
                  <span className="ml-3">{item.name}</span>
                  <StarOff className="hidden group-hover/li:inline-block ml-auto size-2.5" />
                </div>
              </SidebarMenuButton>
            </CollapsibleTrigger>

            <CollapsibleContent>
              <SidebarMenuSub>
                {item.children.map((subItem) => (
                  <SidebarMenuSubItem key={subItem.id}>
                    <SidebarMenuSubButton asChild>
                      <a href={subItem.url}>
                        <span>{subItem.name}</span>
                      </a>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      </li>
    );
  }

  return (
    <li ref={setNodeRef} style={style} className="relative group/li">
      <SidebarMenuItem>
        <SidebarMenuButton asChild tooltip={item.name} className="w-full">
          <a href={item.url} className="flex items-center w-full">
            <button
              aria-label={`Drag ${item.name}`}
              type="button"
              className="absolute -left-1 top-1/2 -translate-y-1/2 hidden group-hover/li:inline-flex items-center justify-center rounded text-muted-foreground hover:text-foreground z-10"
              {...listeners}
              {...attributes}
            >
              <GripVertical className="size-2.5" />
            </button>

            <div className="flex items-center w-full">
              {AvatarIcon}
              <span className="ml-3">{item.name}</span>
              <StarOff className="hidden group-hover/li:inline-block ml-auto size-2.5" />
            </div>
          </a>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </li>
  );
}

export function DraggableNavMain({
  items: initialItems,
  title = "Menu",
  triggerLabel = "Menu",
  onOrderChange,
}: Props) {
  const [items, setItems] = React.useState<NavItem[]>(initialItems);
  const { state } = useSidebar();

  React.useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setItems((currentItems) => {
      const oldIndex = currentItems.findIndex((i) => i.id === active.id);
      const newIndex = currentItems.findIndex((i) => i.id === over.id);
      const newItems = arrayMove(currentItems, oldIndex, newIndex);
      onOrderChange?.(newItems);
      return newItems;
    });
  };

  const [open, setOpen] = React.useState(true);

  const panelRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  const isSidebarExpanded = state === "expanded";

  return (
    <div className="relative">
      {isSidebarExpanded && (
        <button
          ref={triggerRef}
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={`${title}-panel`}
          className="group/button inline-flex w-full items-center justify-between rounded-md p-2 text-sm font-medium hover:bg-accent"
        >
          <span>{triggerLabel}</span>
          <ChevronDown
            className={cn(
              "ml-2 size-4 transition-transform hidden group-hover/button:inline-block",
              open && "rotate-180"
            )}
          />
        </button>
      )}

      <div
        id={`${title}-panel`}
        ref={panelRef}
        className={cn("mt-2", open ? "block" : "hidden")}
        role="region"
      >
        <SidebarGroup>
          <DndContext
            sensors={sensors}
            modifiers={[restrictToVerticalAxis]}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={items.map((i) => i.id)}
              strategy={rectSortingStrategy}
            >
              <SidebarMenu>
                {items.map((item) => (
                  <SortableNavItem key={item.id} item={item} />
                ))}
              </SidebarMenu>
            </SortableContext>
          </DndContext>
        </SidebarGroup>
      </div>
    </div>
  );
}

export default DraggableNavMain;
