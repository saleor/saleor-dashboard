import {
  type DragEndEvent,
  PointerSensor,
  type UniqueIdentifier,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useMemo, useState } from "react";

import { type ProductVariantItem } from "../types";

export interface VariantReorderMove {
  id: string;
  sortOrder: number;
}

interface UseVariantDragProps {
  variants: ProductVariantItem[];
  onReorder: (move: VariantReorderMove) => void;
}

const extractVariantIds = (variants: ProductVariantItem[]): UniqueIdentifier[] =>
  variants
    .filter((variant): variant is NonNullable<typeof variant> => variant !== null)
    .map(variant => variant.id as UniqueIdentifier);

export const useVariantDrag = ({ variants, onReorder }: UseVariantDragProps) => {
  const [isSaving, setIsSaving] = useState(false);
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = variants.findIndex(variant => variant?.id === active.id);
    const newIndex = variants.findIndex(variant => variant?.id === over.id);

    if (oldIndex === -1 || newIndex === -1) {
      return;
    }

    const variant = variants[oldIndex];

    if (!variant) {
      return;
    }

    setIsSaving(true);
    onReorder({
      id: variant.id,
      sortOrder: newIndex - oldIndex,
    });
    setIsSaving(false);
  };

  const items = useMemo(() => extractVariantIds(variants), [variants]);

  return {
    items,
    sensors,
    isSaving,
    handleDragEnd,
  };
};
