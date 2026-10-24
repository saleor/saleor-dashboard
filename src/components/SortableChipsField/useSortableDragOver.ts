import { type ReorderEvent } from "@dashboard/types";
import { type DragOverEvent, type UniqueIdentifier } from "@dnd-kit/core";
import { useMemo } from "react";

/** One form update for a drag: the item's index before the gesture and where it landed. */
export const commitReorderIndexes = (
  sourceIds: string[],
  nextIds: string[],
  activeId: string,
): ReorderEvent | null => {
  const oldIndex = sourceIds.indexOf(activeId);
  const newIndex = nextIds.indexOf(activeId);

  if (oldIndex < 0 || newIndex < 0 || oldIndex === newIndex) {
    return null;
  }

  return { oldIndex, newIndex };
};

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
