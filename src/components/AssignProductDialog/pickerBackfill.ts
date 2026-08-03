/**
 * Assign pickers hide rows the caller has already used up (products in a voucher, in a
 * collection, in a channel) by filtering the fetched page on the client. A page that is
 * mostly filtered away leaves the list too short to scroll, and the infinite scroller only
 * asks for more once the user scrolls, so the picker dead-ends with pages still available.
 * These helpers decide when to pull the next page in on the list's behalf.
 */

/** Keep loading pages until the filtered list has enough rows to be scrollable. */
const BACKFILL_MIN_ROWS = 15;

/** Upper bound on extra pages per search, so a fully used-up catalog can't be walked end to end. */
export const PICKER_BACKFILL_MAX_PAGES = 4;

export type PickerBackfillState = {
  /** Raw result count the last backfill page was requested at, or -1 when none was. */
  requestedAtRawCount: number;
  requestedPages: number;
};

export const createPickerBackfillState = (): PickerBackfillState => ({
  requestedAtRawCount: -1,
  requestedPages: 0,
});

export const isFreshPickerBackfillState = (state: PickerBackfillState): boolean =>
  state.requestedAtRawCount === -1 && state.requestedPages === 0;

export type PickerBackfillStatus = {
  /** More pages are still being pulled in, so an empty list is not yet a real empty state. */
  isBackfilling: boolean;
  /** Backfill gave up with pages still available, so the user has to ask for more explicitly. */
  isExhausted: boolean;
};

/**
 * Whether the short list the user is looking at is mid-backfill or a dead end. Both cases
 * must not render as "no products found": one is premature, the other is a lie the user
 * can do something about.
 */
export const getPickerBackfillStatus = ({
  state,
  enabled,
  hasMore,
  filteredItemCount,
}: {
  state: PickerBackfillState;
  enabled: boolean;
  hasMore: boolean;
  filteredItemCount: number;
}): PickerBackfillStatus => {
  if (!enabled || !hasMore || filteredItemCount >= BACKFILL_MIN_ROWS) {
    return { isBackfilling: false, isExhausted: false };
  }

  const isExhausted = state.requestedPages >= PICKER_BACKFILL_MAX_PAGES;

  return { isBackfilling: !isExhausted, isExhausted };
};

/**
 * Apollo 3.4 leaves `loading` false while `fetchMore` is in flight, so the caller's effect
 * re-runs before new results land. Requesting at most one page per distinct raw result count
 * is what keeps that from turning into a request storm.
 */
export const planPickerBackfill = ({
  state,
  enabled,
  loading,
  hasMore,
  rawItemCount,
  filteredItemCount,
}: {
  state: PickerBackfillState;
  enabled: boolean;
  loading: boolean;
  hasMore: boolean;
  rawItemCount: number;
  filteredItemCount: number;
}): { shouldFetchMore: boolean; state: PickerBackfillState } => {
  // A shorter raw list means a new search replaced the results.
  const current = rawItemCount < state.requestedAtRawCount ? createPickerBackfillState() : state;

  if (
    !enabled ||
    loading ||
    !hasMore ||
    filteredItemCount >= BACKFILL_MIN_ROWS ||
    rawItemCount === current.requestedAtRawCount ||
    current.requestedPages >= PICKER_BACKFILL_MAX_PAGES
  ) {
    return { shouldFetchMore: false, state: current };
  }

  return {
    shouldFetchMore: true,
    state: {
      requestedAtRawCount: rawItemCount,
      requestedPages: current.requestedPages + 1,
    },
  };
};
