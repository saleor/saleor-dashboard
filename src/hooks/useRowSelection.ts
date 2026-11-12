import { type Pagination } from "@dashboard/types";
import { useEffect, useRef, useState } from "react";

export interface UseRowSelection {
  selectedRowIds: string[];
  setSelectedRowIds: React.Dispatch<React.SetStateAction<string[]>>;
  setSelectedRows: (ids: string[]) => void;
  excludeFromSelected: (ids: string[]) => void;
  clearRowSelection: () => void;
  setClearDatagridRowSelectionCallback: (callback: () => void) => void;
}

export const useRowSelection = (paginationParams?: Pagination): UseRowSelection => {
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);
  // Keep reference to clear datagrid selection function
  const clearDatagridRowSelectionCallback = useRef<(() => void) | null>(null);
  const clearRowSelection = () => {
    if (clearDatagridRowSelectionCallback.current) {
      clearDatagridRowSelectionCallback.current();
    }

    setSelectedRowIds([]);
  };

  const setSelectedRows = (ids: string[]) => {
    setSelectedRowIds(ids);
  };

  const excludeFromSelected = (ids: string[]) => {
    setSelectedRowIds(prev => prev.filter(x => !ids.includes(x)));
  };

  const setClearDatagridRowSelectionCallback = (callback: () => void) => {
    clearDatagridRowSelectionCallback.current = callback;
  };

  // Whenever pagination changes we need to clear datagrid selection
  useEffect(
    function clearSelectionOnPageChange() {
      clearRowSelection();
    },
    [paginationParams?.after, paginationParams?.before],
  );

  return {
    selectedRowIds,
    setSelectedRowIds,
    setSelectedRows,
    excludeFromSelected,
    clearRowSelection,
    setClearDatagridRowSelectionCallback,
  };
};

/**
 * Clears the selection when the rows shown change: another filter, search, sort or page, or a
 * refresh that reorders them. The datagrid keeps its selection by row position, so otherwise the
 * selection moves to whichever rows end up in those positions, and a bulk delete removes items
 * nobody picked.
 *
 * Call it after the list query. Pass `rows` as `undefined` while there is no data, e.g. while the
 * query is skipped or loading, so that gap doesn't count as a change: opening a dialog can reload
 * the filters and briefly skip the query, and the dialog still needs the selection.
 */
export const useClearRowSelectionOnRowsChange = ({
  rows,
  clearRowSelection,
}: {
  rows: ReadonlyArray<{ id: string }> | null | undefined;
  clearRowSelection: () => void;
}): void => {
  const rowIds = rows ? rows.map(({ id }) => id).join(",") : null;
  const lastShownRowIds = useRef(rowIds);

  useEffect(
    function clearSelectionOnRowsChange() {
      if (rowIds === null || rowIds === lastShownRowIds.current) {
        return;
      }

      const hadRows = lastShownRowIds.current !== null;

      lastShownRowIds.current = rowIds;

      // Nothing can be selected before the first rows arrive.
      if (hadRows) {
        clearRowSelection();
      }
    },
    [rowIds, clearRowSelection],
  );
};
