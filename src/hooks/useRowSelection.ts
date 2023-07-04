import { Pagination } from "@dashboard/types";
import { useEffect, useRef, useState } from "react";

export const useRowSelection = (paginationParams?: Pagination) => {
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);

  // Keep reference to clear datagrid selection function
  const clearDatagridRowSelectionCallback = useRef<(() => void) | null>(null);

  const clearRowSelection = () => {
    setSelectedRowIds([]);
    if (clearDatagridRowSelectionCallback.current) {
      clearDatagridRowSelectionCallback.current();
    }
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
