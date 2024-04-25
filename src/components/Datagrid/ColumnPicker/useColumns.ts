import useStateFromProps from "@dashboard/hooks/useStateFromProps";
import { addAtIndex, removeAtIndex } from "@dashboard/utils/lists";
import { GridColumn } from "@glideapps/glide-data-grid";
import React from "react";

import { AvailableColumn } from "../types";
import {
  areCategoriesLoaded,
  extractSelectedNodesFromCategories,
  findDynamicColumn,
  isValidColumn,
  mergeSelectedColumns,
  sortColumns,
} from "./utils";

export interface ColumnCategory {
  name: string;
  prefix: string;
  children?: string[];
  hidden?: boolean;
  availableNodes: AvailableColumn[] | undefined;
  selectedNodes: AvailableColumn[] | undefined;
  initialSearch?: string;
  onSearch: (query: string) => void;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  onNextPage: (query: string) => void;
  onPreviousPage: (query: string) => void;
}

export interface UseColumnsProps {
  staticColumns: AvailableColumn[];
  columnCategories?: ColumnCategory[];
  selectedColumns: string[];
  onSave: (columns: string[]) => void;
}

export const useColumns = ({
  staticColumns,
  selectedColumns,
  columnCategories,
  onSave,
}: UseColumnsProps) => {
  const [dynamicColumns, updateDynamicColumns] = React.useState<AvailableColumn[] | null>(null);

  // Dynamic columns are loaded from the API, thus they need to be updated
  // after query resolves with data. Then we also sort them by order of addition
  // by the user, which is saved in LS (columnPickerSettings).
  React.useEffect(() => {
    if (dynamicColumns === null && areCategoriesLoaded(columnCategories)) {
      updateDynamicColumns(
        sortColumns(extractSelectedNodesFromCategories(columnCategories), selectedColumns),
      );
    }
  }, [columnCategories, selectedColumns, dynamicColumns]);

  const initialColumnsState = React.useMemo(
    () => mergeSelectedColumns({ staticColumns, dynamicColumns, selectedColumns }),
    [dynamicColumns, staticColumns, selectedColumns],
  );
  const [recentlyAddedColumn, setRecentlyAddedColumn] = React.useState<string | null>(null);
  const [visibleColumns, setVisibleColumns] = useStateFromProps(initialColumnsState);
  const onMove = React.useCallback(
    (startIndex: number, endIndex: number): void => {
      // When empty column prevent to rearrange it order
      if (visibleColumns[0]?.id === "empty") {
        if (startIndex === 0) {
          return;
        }

        // Keep empty column always at beginning
        if (endIndex === 0) {
          return setVisibleColumns(old =>
            addAtIndex(old[startIndex], removeAtIndex(old, startIndex), endIndex + 1),
          );
        }
      }

      setVisibleColumns(old =>
        addAtIndex(old[startIndex], removeAtIndex(old, startIndex), endIndex),
      );
    },
    [visibleColumns, setVisibleColumns],
  );
  const onResize = React.useCallback(
    (column: GridColumn, newSize: number) => {
      if (column.id === "empty") {
        return;
      }

      return setVisibleColumns(prevColumns =>
        prevColumns.map(prevColumn =>
          prevColumn.id === column.id ? { ...prevColumn, width: newSize } : prevColumn,
        ),
      );
    },
    [setVisibleColumns],
  );
  const onToggle = (columnId: string) => {
    const isAdded = !selectedColumns.includes(columnId);
    const isDynamic = columnId.includes(":");

    if (!isDynamic) {
      if (isAdded) {
        onSave([...selectedColumns, columnId]);
        setRecentlyAddedColumn(columnId);
      } else {
        onSave(selectedColumns.filter(id => id !== columnId));
      }
    }

    if (isDynamic) {
      const [prefix, id] = columnId.split(":");
      const hiddenColumnPrefixes =
        columnCategories?.find(cat => cat.prefix === prefix)?.children ?? [];

      if (isAdded) {
        onSave([
          ...selectedColumns,
          ...hiddenColumnPrefixes.map(prefix => `${prefix}:${id}`),
          columnId,
        ]);
        setRecentlyAddedColumn(columnId);
        updateDynamicColumns(prevDynamicColumns =>
          [
            ...(prevDynamicColumns ?? []),
            ...hiddenColumnPrefixes.map(prefix =>
              findDynamicColumn(columnCategories, `${prefix}:${id}`),
            ),
            findDynamicColumn(columnCategories, columnId),
          ].filter(isValidColumn),
        );
      } else {
        updateDynamicColumns(prevDynamicColumns =>
          (prevDynamicColumns ?? []).filter(column => !column.id.includes(id)),
        );
        onSave(selectedColumns.filter(currentId => !currentId.includes(id)));
      }
    }
  };
  const onClearRecentlyAddedColumn = () => setRecentlyAddedColumn(null);
  // Should be used only for special cases
  const onCustomUpdateVisible = setVisibleColumns;
  const onResetDynamicToInitial = (customSelected?: string[]) => {
    if (areCategoriesLoaded(columnCategories)) {
      updateDynamicColumns(
        sortColumns(
          extractSelectedNodesFromCategories(columnCategories),
          customSelected ?? selectedColumns,
        ),
      );
    }
  };

  return {
    handlers: {
      onMove,
      onResize,
      onToggle,
      onClearRecentlyAddedColumn,
      onCustomUpdateVisible,
      onResetDynamicToInitial,
    },
    visibleColumns,
    staticColumns,
    dynamicColumns,
    selectedColumns,
    columnCategories,
    recentlyAddedColumn,
  };
};
