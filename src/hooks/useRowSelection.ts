import { Pagination } from "@dashboard/types";
import { useEffect, useRef, useState } from "react";

export interface UseRowSelection {
  selectedRowIds: string[];
  setSelectedRowIds: React.Dispatch<React.SetStateAction<string[]>>;
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
  const setClearDatagridRowSelectionCallback = (callback: () => void) => {
    clearDatagridRowSelectionCallback.current = callback;
  };

  // Whenever pagination change we need to clear datagrid selection
  useEffect(() => {
    clearRowSelection();
  }, [paginationParams?.after, paginationParams?.before]);

  return {
    selectedRowIds,
    setSelectedRowIds,
    clearRowSelection,
    setClearDatagridRowSelectionCallback,
  };
};
