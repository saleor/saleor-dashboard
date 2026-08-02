import { useEffect, useRef } from "react";

import { createPickerBackfillState, planPickerBackfill } from "./pickerBackfill";

interface UsePickerBackfillArgs {
  /** Whether the caller filters the fetched page at all. */
  enabled: boolean;
  open: boolean;
  loading: boolean;
  hasMore: boolean;
  rawItemCount: number;
  filteredItemCount: number;
  onFetchMore: () => void;
  /** Bumped by the caller when a new search starts, to hand back the page budget. */
  resetKey?: string;
}

/**
 * Pulls in extra pages while a client-side filter keeps the visible list too short to scroll.
 * See `pickerBackfill.ts` for why the budget and the raw-count guard are needed.
 */
export const usePickerBackfill = ({
  enabled,
  open,
  loading,
  hasMore,
  rawItemCount,
  filteredItemCount,
  onFetchMore,
  resetKey = "",
}: UsePickerBackfillArgs): void => {
  const stateRef = useRef(createPickerBackfillState());
  const onFetchMoreRef = useRef(onFetchMore);

  onFetchMoreRef.current = onFetchMore;

  useEffect(
    function resetPickerBackfillBudget() {
      stateRef.current = createPickerBackfillState();
    },
    [open, resetKey],
  );

  useEffect(
    function backfillFilteredPickerPages() {
      const { shouldFetchMore, state } = planPickerBackfill({
        state: stateRef.current,
        enabled: enabled && open,
        loading,
        hasMore,
        rawItemCount,
        filteredItemCount,
      });

      stateRef.current = state;

      if (shouldFetchMore) {
        onFetchMoreRef.current();
      }
    },
    [enabled, open, loading, hasMore, rawItemCount, filteredItemCount],
  );
};
