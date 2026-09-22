import { type ReorderInput } from "@dashboard/graphql";

export function moveListItem<T>(
  items: T[] | null | undefined,
  move: ReorderInput,
  getId: (item: T) => string,
): T[] {
  if (!items?.length) {
    return items ?? [];
  }

  const fromIndex = items.findIndex(item => getId(item) === move.id);

  if (fromIndex < 0) {
    return items;
  }

  const toIndex = fromIndex + (move.sortOrder ?? 0);
  const withoutMoved = [...items.slice(0, fromIndex), ...items.slice(fromIndex + 1)];

  return [...withoutMoved.slice(0, toIndex), items[fromIndex], ...withoutMoved.slice(toIndex)];
}
