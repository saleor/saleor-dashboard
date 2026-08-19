import { useCallback, useState } from "react";

interface OptimisticPendingIdsResult {
  pendingIds: ReadonlySet<string>;
  markPending: (ids: string[]) => void;
  clearPending: (ids: string[]) => void;
  filterOutPending: <T extends { id: string }>(items: T[]) => T[];
}

/**
 * Track ids removed optimistically from a membership list until the server confirms.
 * On failure, clear those ids so the rows reappear.
 */
export const useOptimisticPendingIds = (): OptimisticPendingIdsResult => {
  const [pendingIds, setPendingIds] = useState<ReadonlySet<string>>(() => new Set());

  const markPending = useCallback((ids: string[]) => {
    if (ids.length === 0) {
      return;
    }

    setPendingIds(prev => {
      const next = new Set(prev);

      for (const id of ids) {
        next.add(id);
      }

      return next;
    });
  }, []);

  const clearPending = useCallback((ids: string[]) => {
    if (ids.length === 0) {
      return;
    }

    setPendingIds(prev => {
      const next = new Set(prev);

      for (const id of ids) {
        next.delete(id);
      }

      return next;
    });
  }, []);

  const filterOutPending = useCallback(
    <T extends { id: string }>(items: T[]): T[] => items.filter(item => !pendingIds.has(item.id)),
    [pendingIds],
  );

  return {
    pendingIds,
    markPending,
    clearPending,
    filterOutPending,
  };
};
