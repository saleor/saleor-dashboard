import { type PaginationState } from "@dashboard/hooks/useLocalPaginator";
import { useSuppressClickAfterDrag } from "@dashboard/hooks/useSuppressClickAfterDrag";
import {
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useCallback, useEffect, useState } from "react";

import { type Product } from "./types";
import { useProductReorder } from "./useProductReorder";

interface ProductDragProps {
  products: Product[];
  paginationState: PaginationState;
}

export const useProductDrag = ({ products, paginationState }: ProductDragProps) => {
  const [items, setItems] = useState(products);
  const { move, data } = useProductReorder({ paginationState });
  const suppressClickAfterDrag = useSuppressClickAfterDrag();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  useEffect(() => {
    setItems(products);
  }, [products]);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      suppressClickAfterDrag();

      const { active, over } = event;

      if (active.id !== over?.id) {
        setItems(currentItems => {
          const oldIndex = currentItems.findIndex(item => item.id === active.id);
          const newIndex = currentItems.findIndex(item => item.id === over?.id);
          const diff = oldIndex - newIndex;
          const moved = arrayMove(currentItems, oldIndex, newIndex);
          const productId = active.id as string;

          move(moved, productId, diff);

          return moved;
        });
      }
    },
    [move, suppressClickAfterDrag],
  );

  const handleDragCancel = useCallback(() => {
    suppressClickAfterDrag();
  }, [suppressClickAfterDrag]);

  return {
    isSaving: data?.loading,
    sensors,
    items,
    handleDragEnd,
    handleDragCancel,
  };
};
