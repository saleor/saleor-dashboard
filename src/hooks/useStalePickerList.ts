import { useEffect, useRef } from "react";

/**
 * Keeps the previous list visible while a search refetch is in flight so picker
 * modals do not collapse to an empty state between queries.
 */
export function useStalePickerList<T>(
  items: T[] | undefined | null,
  loading: boolean,
  open = true,
): T[] {
  const staleItemsRef = useRef<T[]>([]);

  useEffect(() => {
    if (!open) {
      staleItemsRef.current = [];
    }
  }, [open]);

  const resolvedItems = items ?? [];

  if (!loading) {
    staleItemsRef.current = resolvedItems;

    return resolvedItems;
  }

  if (resolvedItems.length > 0) {
    staleItemsRef.current = resolvedItems;

    return resolvedItems;
  }

  return staleItemsRef.current;
}
