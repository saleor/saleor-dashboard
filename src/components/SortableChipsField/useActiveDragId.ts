import { DragStartEvent, UniqueIdentifier } from "@dnd-kit/core";
import { useCallback, useState } from "react";

/**
 * Manages the active draggable item's by providing methods for DndContext from @dnd-kit/core.
 */
export const useActiveDragId = () => {
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id);
  }, []);

  const handleDragEnd = useCallback(() => {
    setActiveId(null);
  }, []);

  return { activeId, handleDragStart, handleDragEnd };
};
