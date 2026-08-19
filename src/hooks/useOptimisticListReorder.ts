import { type ReorderAction, type ReorderEvent } from "@dashboard/types";
import { arrayMove } from "@dnd-kit/sortable";
import { useCallback, useEffect, useState } from "react";

const emptyItems: never[] = [];

/**
 * Keep sortable rows in the dropped order immediately, then let the parent
 * persist. Incoming props replace the local list when membership changes
 * (assign/unassign) or when the server/cache catches up.
 */
export const useOptimisticListReorder = <T>(
  items: T[] | null | undefined,
  onReorder: ReorderAction,
): { items: T[]; onSortEnd: ReorderAction } => {
  const sourceItems = items ?? emptyItems;
  const [orderedItems, setOrderedItems] = useState<T[]>(sourceItems);

  // Local order is the optimistic source of truth until Apollo cache / the server catch up.
  useEffect(
    function syncOrderedItemsFromProps() {
      setOrderedItems(sourceItems);
    },
    [sourceItems],
  );

  const onSortEnd = useCallback(
    (event: ReorderEvent) => {
      setOrderedItems(current => arrayMove(current, event.oldIndex, event.newIndex));
      onReorder(event);
    },
    [onReorder],
  );

  return { items: orderedItems, onSortEnd };
};
