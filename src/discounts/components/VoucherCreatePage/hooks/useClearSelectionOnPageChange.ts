import { useEffect, useRef } from "react";

/**
 * Row selection only covers the visible page. Clear it whenever the visible page changes, whether
 * the user paged, changed the page size, or removing items moved the list back a page, so a bulk
 * action never touches rows the user can't see.
 */
export const useClearSelectionOnPageChange = (
  pageStart: number,
  clearSelection: () => void,
): void => {
  const clearSelectionRef = useRef(clearSelection);

  useEffect(
    function keepLatestClearSelection() {
      clearSelectionRef.current = clearSelection;
    },
    [clearSelection],
  );

  const isFirstRender = useRef(true);

  useEffect(
    function clearSelectionWhenPageChanges() {
      if (isFirstRender.current) {
        isFirstRender.current = false;

        return;
      }

      clearSelectionRef.current();
    },
    [pageStart],
  );
};
