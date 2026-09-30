"use client";

import React from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

type SortableItemProps = {
  id: string;
  children: React.ReactNode;
  showHandle?: boolean;
};

export function SortableItem({ id, children, showHandle = true }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 20 : 1,
    opacity: isDragging ? 0.6 : 1
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group ${isDragging ? "shadow-2xl ring-2 ring-(--color-accent) rounded-2xl" : ""}`}
    >
      <div className="flex items-center gap-3">
        {showHandle && (
          <button
            type="button"
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing text-normal hover:text-highlight p-1.5 rounded-lg hover:bg-white/5 transition shrink-0"
            title="Drag to reorder"
            aria-label="Drag to reorder"
          >
            <GripVertical size={18} />
          </button>
        )}
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  );
}

type SortableListProps<T extends { id: string }> = {
  items: T[];
  onReorder: (newItems: T[]) => void;
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor?: (item: T) => string;
  showHandle?: boolean;
};

export function SortableList<T extends { id: string }>({
  items,
  onReorder,
  renderItem,
  keyExtractor = (item) => item.id,
  showHandle = true
}: SortableListProps<T>) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5
      }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => keyExtractor(item) === active.id);
      const newIndex = items.findIndex((item) => keyExtractor(item) === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const reordered = arrayMove(items, oldIndex, newIndex).map((item, idx) => ({
          ...item,
          order: idx + 1
        }));
        onReorder(reordered);
      }
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map(keyExtractor)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-3">
          {items.map((item, index) => (
            <SortableItem
              key={keyExtractor(item)}
              id={keyExtractor(item)}
              showHandle={showHandle}
            >
              {renderItem(item, index)}
            </SortableItem>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
