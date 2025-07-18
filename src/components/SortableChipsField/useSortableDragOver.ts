import { ReorderEvent } from "@dashboard/types";
import { DragOverEvent, UniqueIdentifier } from "@dnd-kit/core";
import { useMemo } from "react";

interface Item {
  value: UniqueIdentifier;
  [key: string]: any;
}

interface UseSortableDragOverProps {
  items: Item[];
  onReorder: (event: ReorderEvent) => void;
}

export const useSortableDragOver = ({ items, onReorder }: UseSortableDragOverProps) => {
  // Create a map to quickly find the index of an item by its value
  const itemIndexMap = useMemo(() => {
    return new Map<UniqueIdentifier, number>(items.map((item, index) => [item.value, index]));
  }, [items]);

  const handleDragOver = useMemo(
    () => (event: DragOverEvent) => {
      const { active, over } = event;

      if (!over || active.id === over.id) {
        return;
      }

      const oldIndex = itemIndexMap.get(active.id);
      const newIndex = itemIndexMap.get(over.id);

      if (oldIndex !== undefined && newIndex !== undefined && oldIndex !== newIndex) {
        onReorder({ oldIndex, newIndex });
      }
    },
    [onReorder, itemIndexMap],
  );

  return { handleDragOver };
};
