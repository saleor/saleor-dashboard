import useStateFromProps from "@dashboard/hooks/useStateFromProps";
import { addAtIndex, removeAtIndex } from "@dashboard/utils/lists";
import { GridColumn } from "@glideapps/glide-data-grid";
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
  const dynamicColumns: AvailableColumn[] = React.useMemo(
    () =>
      columnCategories.reduce<AvailableColumn[]>(
        (columns: AvailableColumn[], category) => {
          category.selectedNodes.forEach(column => {
            if (columnPickerSettings.includes(column.id)) {
              columns.push(column);
            }
          });
          return columns;
        },
        [],
      ),
    [columnCategories, columnPickerSettings],
  );

  const initialColumnsState = React.useMemo(
    () =>
      [...staticColumns, ...dynamicColumns].filter(
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
      setVisibleColumns(old =>
        addAtIndex(old[startIndex], removeAtIndex(old, startIndex), endIndex),
      );
    },
    [setVisibleColumns],
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
    const isColumnAdded = columns.length > selectedColumns.length;
    if (isColumnAdded) {
      setRecentlyAddedColumn(columns.find(x => !selectedColumns.includes(x)));
    } else {
      setRecentlyAddedColumn(null);
    }
    onSave(columns);
  };

  const onDynamicColumnSelect = setDynamicColumnSettings;

  return {
    handlers: {
      onMove,
      onResize,
      onChange,
      onDynamicColumnSelect,
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
