import { UniqueIdentifier } from "@dnd-kit/core";
import { useEffect, useMemo, useState } from "react";

import { TreeItems } from "../types";
import { flattenTree, removeChildrenOf } from "../utils";

interface UseItemsProps<T> {
  defaultItems: TreeItems<T>;
  activeId: UniqueIdentifier | null;
}

export const useItems = <T>({ defaultItems, activeId }: UseItemsProps<T>) => {
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
