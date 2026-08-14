import { createContext, useContext } from "react";

interface SortableTableState {
  disabled: boolean;
  isSorting: boolean;
}

export const SortableTableStateContext = createContext<SortableTableState>({
  disabled: false,
  isSorting: false,
});

export const useSortableContext = (): SortableTableState => useContext(SortableTableStateContext);
