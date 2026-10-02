/**
 * Position label for a reference row. Ids from the last save keep that number.
 * Ids added since then get the next free number, once, until the next save.
 * No saved list means the caller should use the live index.
 */
export function savedReferencePosition({
  id,
  savedIds,
  provisional,
}: {
  id: string;
  savedIds: readonly string[] | undefined;
  provisional: Map<string, number>;
}): number | null {
  if (!savedIds) {
    return null;
  }

  const savedIndex = savedIds.indexOf(id);

  if (savedIndex >= 0) {
    return savedIndex + 1;
  }

  const assigned = provisional.get(id);

  if (assigned !== undefined) {
    return assigned;
  }

  const next = Math.max(savedIds.length, ...provisional.values(), 0) + 1;

  provisional.set(id, next);

  return next;
}
