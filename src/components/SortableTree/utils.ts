import type { UniqueIdentifier } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

import type {
  DataTypePlaceholder,
  FlattenedItem,
  FlattenedItems,
  Projected,
  TreeItem,
  TreeItems,
} from "./types";

function getDragDepth(offset: number, indentationWidth: number) {
  return Math.round(offset / indentationWidth);
}

export function getProjection<T extends DataTypePlaceholder>(
  items: FlattenedItems<T>,
  activeId: UniqueIdentifier,
  overId: UniqueIdentifier,
  dragOffset: number,
  indentationWidth: number,
): Projected {
  const overItemIndex = items.findIndex(({ id }) => id === overId);
  const activeItemIndex = items.findIndex(({ id }) => id === activeId);
  const activeItem = items[activeItemIndex];
  const newItems = arrayMove(items, activeItemIndex, overItemIndex);
  const previousItem = newItems[overItemIndex - 1];
  const nextItem = newItems[overItemIndex + 1];
  const dragDepth = getDragDepth(dragOffset, indentationWidth);
  const projectedDepth = activeItem.depth + dragDepth;
  const maxDepth = getMaxDepth({
    previousItem,
  });
  const minDepth = getMinDepth({ nextItem });
  let depth = projectedDepth;

  if (projectedDepth >= maxDepth) {
    depth = maxDepth;
  } else if (projectedDepth < minDepth) {
    depth = minDepth;
  }

  return { depth, maxDepth, minDepth, parentId: getParentId() };

  function getParentId() {
    if (depth === 0 || !previousItem) {
      return null;
    }

    if (depth === previousItem.depth) {
      return previousItem.parentId;
    }

    if (depth > previousItem.depth) {
      return previousItem.id;
    }

    const newParent = newItems
      .slice(0, overItemIndex)
      .reverse()
      .find(item => item.depth === depth)?.parentId;

    return newParent ?? null;
  }
}

function getMaxDepth<T extends DataTypePlaceholder>({
  previousItem,
}: {
  previousItem: FlattenedItem<T>;
}) {
  if (previousItem) {
    return previousItem.depth + 1;
  }

  return 0;
}

function getMinDepth<T extends DataTypePlaceholder>({ nextItem }: { nextItem: FlattenedItem<T> }) {
  if (nextItem) {
    return nextItem.depth;
  }

  return 0;
}

function flatten<T extends DataTypePlaceholder>(
  items: TreeItems<T>,
  parentId: UniqueIdentifier | null = null,
  depth = 0,
): FlattenedItems<T> {
  return items.reduce<FlattenedItems<T>>((acc, item, index) => {
    return [
      ...acc,
      { ...item, parentId, depth, index },
      ...flatten(item.children, item.id, depth + 1),
    ];
  }, []);
}

export function flattenTree<T extends DataTypePlaceholder>(items: TreeItems<T>): FlattenedItems<T> {
  return flatten(items);
}

export function buildTree<T extends DataTypePlaceholder>(
  flattenedItems: FlattenedItems<T>,
): TreeItems<T> {
  const root: TreeItem<T> = { id: "root", data: null as T, children: [] };
  const nodes: Record<string, TreeItem<T>> = { [root.id]: root };
  const items = flattenedItems.map(item => ({ ...item, children: [] }));

  for (const item of items) {
    const { id, children } = item;
    const parentId = item.parentId ?? root.id;
    const parent = nodes[parentId] ?? findItem(items, parentId);

    nodes[id] = { id, children, data: null as T };
    parent.children.push(item);
  }

  return root.children;
}

export function findItem<T extends DataTypePlaceholder>(
  items: Array<TreeItem<T>>,
  itemId: UniqueIdentifier,
) {
  return items.find(({ id }) => id === itemId);
}

export function findItemDeep<T extends DataTypePlaceholder>(
  items: TreeItems<T>,
  itemId: UniqueIdentifier,
): TreeItem<T> | undefined {
  for (const item of items) {
    const { id, children } = item;

    if (id === itemId) {
      return item;
    }

    if (children.length) {
      const child = findItemDeep(children, itemId);

      if (child) {
        return child;
      }
    }
  }

  return undefined;
}

function countChildren<T extends DataTypePlaceholder>(
  items: Array<TreeItem<T>>,
  count = 0,
): number {
  return items.reduce((acc, { children }) => {
    if (children.length) {
      return countChildren(children, acc + 1);
    }

    return acc + 1;
  }, count);
}

export function getChildCount<T extends DataTypePlaceholder>(
  items: TreeItems<T>,
  id: UniqueIdentifier,
) {
  const item = findItemDeep(items, id);

  return item ? countChildren(item.children) : 0;
}

export function removeChildrenOf<T extends DataTypePlaceholder>(
  items: FlattenedItems<T>,
  ids: UniqueIdentifier[],
) {
  const excludeParentIds = [...ids];

  return items.filter(item => {
    if (item.parentId && excludeParentIds.includes(item.parentId)) {
      if (item.children.length) {
        excludeParentIds.push(item.id);
      }
      return false;
    }

    return true;
  });
}
