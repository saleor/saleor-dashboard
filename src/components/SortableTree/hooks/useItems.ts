import { UniqueIdentifier } from "@dnd-kit/core";
import { useEffect, useMemo, useState } from "react";

import { DataTypePlaceholder, TreeItems } from "../types";
import { flattenTree, removeChildrenOf } from "../utils";

interface UseItemsProps<T extends DataTypePlaceholder> {
  defaultItems: TreeItems<T>;
  activeId: UniqueIdentifier | null;
}

export const useItems = <T extends DataTypePlaceholder>({
  defaultItems,
  activeId,
}: UseItemsProps<T>) => {
  const [items, setItems] = useState(defaultItems);

  useEffect(() => {
    setItems(defaultItems);
  }, [defaultItems]);

  const flattenedItems = useMemo(() => {
    const flattenedTree = flattenTree(items);

    return removeChildrenOf(flattenedTree, activeId ? [activeId] : []);
  }, [activeId, items]);

  return {
    items,
    setItems,
    flattenedItems,
  };
};
