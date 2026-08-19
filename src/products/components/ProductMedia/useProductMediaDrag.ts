import { type ProductMediaFragment } from "@dashboard/graphql";
import { type ReorderAction } from "@dashboard/types";
import {
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
  PointerSensor,
  type UniqueIdentifier,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useEffect, useMemo, useRef, useState } from "react";

interface UseProductMediaDragProps {
  media: ProductMediaFragment[];
  onReorder?: ReorderAction;
  disabled?: boolean;
}

export const useProductMediaDrag = ({
  media,
  onReorder,
  disabled = false,
}: UseProductMediaDragProps) => {
  const [orderedMedia, setOrderedMedia] = useState(media);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const orderedMediaRef = useRef(orderedMedia);

  orderedMediaRef.current = orderedMedia;

  useEffect(() => {
    if (activeId === null) {
      setOrderedMedia(media);
    }
  }, [media, activeId]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        // Match previous react-sortable-hoc `distance={20}` so clicks still work
        distance: 20,
      },
    }),
  );

  const items: UniqueIdentifier[] = useMemo(
    () => orderedMedia.map(item => item.id),
    [orderedMedia],
  );

  const activeMedia = useMemo(
    () => orderedMedia.find(item => item.id === activeId) ?? null,
    [activeId, orderedMedia],
  );

  const handleDragStart = (event: DragStartEvent) => {
    if (disabled) {
      return;
    }

    setActiveId(event.active.id);
  };

  const handleDragOver = (event: DragOverEvent) => {
    if (disabled) {
      return;
    }

    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    setOrderedMedia(current => {
      const oldIndex = current.findIndex(item => item.id === active.id);
      const newIndex = current.findIndex(item => item.id === over.id);

      if (oldIndex < 0 || newIndex < 0 || oldIndex === newIndex) {
        return current;
      }

      return arrayMove(current, oldIndex, newIndex);
    });
  };

  const finishDrag = () => {
    const draggedId = activeId;

    setActiveId(null);

    if (disabled || !onReorder || draggedId == null) {
      return;
    }

    const endIds = orderedMediaRef.current.map(item => item.id);
    const currentIds = media.map(item => item.id);
    const draggedIdString = String(draggedId);

    // Media set must be unchanged (upload/delete during drag) and a pure reordering
    const isSameSet =
      endIds.length === currentIds.length &&
      currentIds.every(id => endIds.includes(id)) &&
      endIds.every(id => currentIds.includes(id));

    if (!isSameSet) {
      setOrderedMedia(media);

      return;
    }

    // Indices relative to the live product.media list the mutation will arrayMove
    const oldIndex = currentIds.indexOf(draggedIdString);
    const newIndex = endIds.indexOf(draggedIdString);

    if (oldIndex < 0 || newIndex < 0 || oldIndex === newIndex) {
      return;
    }

    onReorder({ oldIndex, newIndex });
  };

  const handleDragEnd = (_event: DragEndEvent) => {
    finishDrag();
  };

  const handleDragCancel = () => {
    setActiveId(null);
    setOrderedMedia(media);
  };

  return {
    orderedMedia,
    activeId,
    activeMedia,
    items,
    sensors,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDragCancel,
  };
};
