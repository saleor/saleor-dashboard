import { useCallback, useEffect, useRef, useState } from "react";

import {
  createPickerBackfillState,
  getPickerBackfillStatus,
  isFreshPickerBackfillState,
  PICKER_BACKFILL_MAX_PAGES,
  type PickerBackfillStatus,
  planPickerBackfill,
} from "./pickerBackfill";

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
  /** Lower this when one item renders as several rows. See `BACKFILL_MIN_ROWS`. */
  minRows?: number;
}

interface UsePickerBackfillResult extends PickerBackfillStatus {
  /** Hands the page budget back so the next pages get pulled in. */
  resumeBackfill: () => void;
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
  minRows,
}: UsePickerBackfillArgs): UsePickerBackfillResult => {
  const [state, setState] = useState(createPickerBackfillState);
  const onFetchMoreRef = useRef(onFetchMore);

  onFetchMoreRef.current = onFetchMore;

  const resumeBackfill = useCallback(() => {
    // Only hand the budget back once it is actually spent. Mid-backfill / double-clicks must
    // not reset `requestedAtRawCount`, or the effect would fire a second fetchMore for the
    // same cursor while Apollo 3.4 still reports `loading: false`.
    setState(current =>
      current.requestedPages >= PICKER_BACKFILL_MAX_PAGES ? createPickerBackfillState() : current,
    );
  }, []);

  useEffect(
    function resetPickerBackfillBudget() {
      setState(current =>
        isFreshPickerBackfillState(current) ? current : createPickerBackfillState(),
      );
    },
    [open, resetKey],
  );

  useEffect(
    function backfillFilteredPickerPages() {
      const { shouldFetchMore, state: nextState } = planPickerBackfill({
        state,
        enabled: enabled && open,
        loading,
        hasMore,
        rawItemCount,
        filteredItemCount,
        minRows,
      });

      if (nextState !== state) {
        setState(nextState);
      }

      if (shouldFetchMore) {
        onFetchMoreRef.current();
      }
    },
    [state, enabled, open, loading, hasMore, rawItemCount, filteredItemCount, minRows],
  );

  const { isBackfilling, isExhausted } = getPickerBackfillStatus({
    state,
    enabled: enabled && open,
    hasMore,
    filteredItemCount,
    minRows,
  });

  return { isBackfilling, isExhausted, resumeBackfill };
};
