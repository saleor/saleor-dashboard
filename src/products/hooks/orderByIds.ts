/**
 * Puts `items` in the order `orderedIds` gives. Items the order doesn't name (loaded after it
 * was made) keep their own order and come last.
 */
export const orderByIds = <TItem>(
  items: readonly TItem[],
  getId: (item: TItem) => string,
  orderedIds: readonly string[],
): TItem[] => {
  const rank = new Map(orderedIds.map((id, index) => [id, index]));
  const rankOf = (item: TItem): number => rank.get(getId(item)) ?? orderedIds.length;

  return [...items].sort((first, second) => rankOf(first) - rankOf(second));
};
