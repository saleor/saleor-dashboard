/**
 * Pure helper that arranges Model Types into the order shown in the tab strip.
 *
 * Order rules:
 *  1. Pinned types appear first, in pin order (insertion order from
 *     `pinnedTypeIds`). User-controlled — don't sort alphabetically.
 *  2. Unpinned types fill the remaining visible slots, alphabetically.
 *  3. Anything that doesn't fit goes into `overflowTypes`.
 *  4. If `activeTypeId` is unpinned and lives in overflow, it is promoted
 *     into the last visible slot so the user always sees what's selected.
 *     The displaced type returns to overflow in alphabetical position.
 *
 * Slot accounting:
 *  - `visibleSlots` is a *target*. Pinned types always show, even if they
 *    exceed the target (the user explicitly asked for them on top).
 *  - Active-type promotion only kicks in when there's an alphabetical region
 *    to displace into; if there isn't one, the active type stays in overflow.
 *
 * Used by `ModelTypeTabs` for layout AND by `PageList` to decide which type
 * counts to actually fetch (lazy-counts strategy).
 */
export interface ModelType {
  id: string;
  name: string;
}

interface ComputeArgs {
  types: ModelType[];
  pinnedTypeIds: string[];
  activeTypeId: string | null;
  visibleSlots: number;
}

interface ComputeResult {
  /** Pinned types in pin order, always visible. */
  pinnedVisibleTypes: ModelType[];
  /** Alphabetical types filling the remaining visible slots (after promotion). */
  alphabeticalVisibleTypes: ModelType[];
  /** Types that didn't fit into the visible row. */
  overflowTypes: ModelType[];
  /**
   * The full visible row, in render order: pinned ∪ alphabetical.
   * Convenience for callers that don't need the section split.
   */
  allVisibleTypes: ModelType[];
}

const byNameAscending = (a: ModelType, b: ModelType): number => a.name.localeCompare(b.name);

export const computeVisibleTypes = ({
  types,
  pinnedTypeIds,
  activeTypeId,
  visibleSlots,
}: ComputeArgs): ComputeResult => {
  const byId = new Map(types.map(t => [t.id, t]));
  const pinnedSet = new Set(pinnedTypeIds);
  // Materialize pinned in insertion order, dropping any stale ids that no
  // longer exist on the backend (deleted types).
  const pinnedVisibleTypes = pinnedTypeIds
    .map(id => byId.get(id))
    .filter((t): t is ModelType => t !== undefined);
  const unpinnedSorted = types.filter(t => !pinnedSet.has(t.id)).sort(byNameAscending);

  // Pinned always show; alphabetical takes whatever budget remains.
  const alphabeticalSlotBudget = Math.max(0, visibleSlots - pinnedVisibleTypes.length);
  let alphabeticalVisibleTypes = unpinnedSorted.slice(0, alphabeticalSlotBudget);
  let overflowTypes = unpinnedSorted.slice(alphabeticalSlotBudget);

  // Promote the active type into the visible row if it's unpinned and overflowed.
  // Pinned types are already visible by construction.
  const isActiveAlreadyVisible =
    activeTypeId === null ||
    pinnedSet.has(activeTypeId) ||
    alphabeticalVisibleTypes.some(t => t.id === activeTypeId);

  if (!isActiveAlreadyVisible && activeTypeId) {
    const promoted = overflowTypes.find(t => t.id === activeTypeId);

    if (promoted) {
      if (alphabeticalVisibleTypes.length === 0) {
        // No alphabetical slot to displace — give the active type its own slot.
        alphabeticalVisibleTypes = [promoted];
        overflowTypes = overflowTypes.filter(t => t.id !== activeTypeId).sort(byNameAscending);
      } else {
        const displaced = alphabeticalVisibleTypes[alphabeticalVisibleTypes.length - 1];

        alphabeticalVisibleTypes = [...alphabeticalVisibleTypes.slice(0, -1), promoted];
        overflowTypes = [displaced, ...overflowTypes.filter(t => t.id !== activeTypeId)].sort(
          byNameAscending,
        );
      }
    }
  }

  return {
    pinnedVisibleTypes,
    alphabeticalVisibleTypes,
    overflowTypes,
    allVisibleTypes: [...pinnedVisibleTypes, ...alphabeticalVisibleTypes],
  };
};
