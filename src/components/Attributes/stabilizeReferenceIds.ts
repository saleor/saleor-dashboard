/** GraphQL `where: { ids }` does not care about order. The page stays the first
 * `max` ids in display order; sorting only that page keeps Apollo's cache key
 * stable when those rows are reordered. */
export const stabilizeReferenceIds = (ids: string[], max: number): string[] => {
  const page: string[] = [];
  const seen = new Set<string>();

  for (const id of ids) {
    if (seen.has(id)) {
      continue;
    }

    seen.add(id);
    page.push(id);

    if (page.length === max) {
      break;
    }
  }

  return page.sort();
};
