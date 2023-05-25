import useStateFromProps from "@dashboard/hooks/useStateFromProps";
import { addAtIndex, removeAtIndex } from "@dashboard/utils/lists";
import { GridColumn } from "@glideapps/glide-data-grid";
import uniqBy from "lodash/uniqBy";
import React from "react";

import { AvailableColumn } from "../Datagrid/types";

export interface ColumnCategory {
  name: string;
  prefix: string;
  availableNodes: AvailableColumn[];
  selectedNodes: AvailableColumn[];
  onSearch?: (query: string) => void;
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
  columnPickerSettings: string[];
  setDynamicColumnSettings: (cols: string[]) => void;
}

export const useColumns = ({
  staticColumns,
  selectedColumns,
  columnCategories,
  onSave,
  columnPickerSettings,
  setDynamicColumnSettings,
}: UseColumnsProps) => {
  const [dynamicColumns, updateDynamicColumns] =
    React.useState<AvailableColumn[]>(null);

  React.useEffect(() => {
    if (
      dynamicColumns === null &&
      columnCategories.every(category => Array.isArray(category.selectedNodes))
    ) {
      updateDynamicColumns(
        columnCategories
          .flatMap(category => category.selectedNodes)
          .sort(
            (a, b) =>
              columnPickerSettings.indexOf(a.id) -
              columnPickerSettings.indexOf(b.id),
          ),
      );
    }
  }, [columnCategories, columnPickerSettings, dynamicColumns]);

  const initialColumnsState = React.useMemo(
    () =>
      [...staticColumns, ...(dynamicColumns ?? [])].filter(
        column => selectedColumns.includes(column.id) || column.id === "empty",
      ),
    [dynamicColumns, staticColumns, selectedColumns],
  );

  const [recentlyAddedColumn, setRecentlyAddedColumn] = React.useState<
    string | null
  >(null);

  const [visibleColumns, setVisibleColumns] =
    useStateFromProps(initialColumnsState);

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
            addAtIndex(
              old[startIndex],
              removeAtIndex(old, startIndex),
              endIndex + 1,
            ),
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
          prevColumn.id === column.id
            ? { ...prevColumn, width: newSize }
            : prevColumn,
        ),
      );
    },
    [setVisibleColumns],
  );

  const onChange = (columns: string[]) => {
    // Recently added is used by datagrid to auto-scroll to the column
    const isColumnAdded = columns.length > selectedColumns.length;
    if (isColumnAdded) {
      setRecentlyAddedColumn(columns.find(x => !selectedColumns.includes(x)));
    } else {
      setRecentlyAddedColumn(null);
    }
    // Saves in LS
    onSave(columns);
  };

  // Should be used only for special cases
  const onCustomUpdateVisible = setVisibleColumns;

  const onDynamicColumnSelect = (columns: string[]) => {
    setDynamicColumnSettings(columns);

    updateDynamicColumns(prevDynamicColumns =>
      uniqBy(
        [
          ...(prevDynamicColumns ?? []),
          ...columnCategories
            .flatMap(category => category.availableNodes)
            .filter(x => columns.includes(x.id)),
        ],
        "id",
      )
        .sort((a, b) => columns.indexOf(a.id) - columns.indexOf(b.id))
        .filter(x => columns.includes(x.id)),
    );
  };

  return {
    handlers: {
      onMove,
      onResize,
      onChange,
      onDynamicColumnSelect,
      onCustomUpdateVisible,
    },
    visibleColumns,
    staticColumns,
    dynamicColumns,
    selectedColumns,
    columnCategories,
    columnPickerSettings,
    recentlyAddedColumn,
  };
};
