import {
  DragEndEvent,
  PointerSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useState } from "react";

import { ProductVariantItem } from "../types";

interface UseVariantDragProps {
  variants: ProductVariantItem[];
  onReorder: (event: { oldIndex: number; newIndex: number }) => void;
}

const extractVariantIds = (variants: ProductVariantItem[]): UniqueIdentifier[] =>
  variants
    ?.filter((variant): variant is NonNullable<typeof variant> => variant !== null)
    .map(variant => variant.id as UniqueIdentifier) ?? [];

export const useVariantDrag = ({ variants, onReorder }: UseVariantDragProps) => {
  const [isSaving, setIsSaving] = useState(false);
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    setIsSaving(true);

    const oldIndex = variants.findIndex(variant => variant?.id === active.id);
    const newIndex = variants.findIndex(variant => variant?.id === over.id);

    onReorder({ oldIndex, newIndex });
    setIsSaving(false);
  };

  const items = extractVariantIds(variants);

  return {
    items,
    sensors,
    isSaving,
    handleDragEnd,
  };
};
