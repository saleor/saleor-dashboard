import { PaginationState } from "@dashboard/hooks/useLocalPaginator";
import { DragEndEvent, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useEffect, useState } from "react";

import { Product } from "./types";
import { useProductReorder } from "./useProductReorder";

interface ProductDragProps {
  products: Product[];
  paginationState: PaginationState;
}

export const useProductDrag = ({ products, paginationState }: ProductDragProps) => {
  const [items, setItems] = useState(products);
  const { move, data } = useProductReorder({ paginationState });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  useEffect(() => {
    setItems(products);
  }, [products]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setItems(items => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over?.id);
        const diff = oldIndex - newIndex;

        move([active.id as string], diff);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return {
    isSaving: data?.loading,
    sensors,
    items,
    handleDragEnd,
  };
};
