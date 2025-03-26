import { DragEndEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { useState } from "react";

interface UseVariantDragProps {
  variants: any[];
  onReorder: (event: { oldIndex: number; newIndex: number }) => void;
}

export const useVariantDrag = ({ variants, onReorder }: UseVariantDragProps) => {
  const [isSaving, setIsSaving] = useState(false);
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    setIsSaving(true);

    const oldIndex = variants.findIndex(variant => variant.id === active.id);
    const newIndex = variants.findIndex(variant => variant.id === over.id);

    onReorder({ oldIndex, newIndex });
    setIsSaving(false);
  };

  const items = variants?.map(variant => variant.id) ?? [];

  return {
    items,
    sensors,
    isSaving,
    handleDragEnd,
  };
};
