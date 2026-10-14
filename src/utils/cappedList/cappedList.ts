/** How many names a sentence lists before the rest collapse into a count. */
const CAPPED_LIST_LIMIT = 5;

/**
 * Names for a sentence like "A, B, C, D, E, and 12 other zones". Long lists of names in one
 * sentence cannot be scanned, so past `limit` the remainder becomes a single counted item.
 */
export const cappedListItems = ({
  items,
  formatOthers,
  limit = CAPPED_LIST_LIMIT,
}: {
  items: string[];
  /** Renders the remainder, e.g. "12 other shipping zones". */
  formatOthers: (count: number) => string;
  limit?: number;
}): string[] => {
  if (items.length <= limit) {
    return items;
  }

  return [...items.slice(0, limit), formatOthers(items.length - limit)];
};
