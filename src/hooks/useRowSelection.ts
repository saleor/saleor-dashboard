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

export const useRowSelection = (
  paginationParams?: Pagination,
  {
    resetKey,
  }: {
    /**
     * Clears the selection whenever it changes. Pass something that changes with the rows shown,
     * such as their ids: the datagrid keeps its selection by row position, so without a reset it
     * would move to whichever rows end up in those positions.
     */
    resetKey?: string;
  } = {},
): UseRowSelection => {
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

  // Whenever pagination or the rows shown change we need to clear datagrid selection
  useEffect(
    function clearSelectionOnPageOrQueryChange() {
      clearRowSelection();
    },
    [paginationParams?.after, paginationParams?.before, resetKey],
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
