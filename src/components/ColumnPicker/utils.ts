import useStateFromProps from "@dashboard/hooks/useStateFromProps";
import { FetchMoreProps } from "@dashboard/types";
import { addAtIndex, removeAtIndex } from "@dashboard/utils/lists";
import { GridColumn } from "@glideapps/glide-data-grid";
import React from "react";

import { AvailableColumn } from "../Datagrid/types";

export interface ColumnCategory extends Partial<FetchMoreProps> {
  name: string;
  prefix: string;
  availableNodes: AvailableColumn[];
  selectedNodes: AvailableColumn[];
  onSearch?: (query: string) => void;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  totalCount: number;
  onFetchMore: () => void;
}

export interface UseColumnsProps {
  staticColumns: AvailableColumn[];
  columnCategories?: ColumnCategory[];
  selectedColumns: string[];
  onSave: (columns: string[]) => void;
  customColumnSettings: string[];
  setCustomColumnSettings: (cols: string[]) => void;
}

export const useColumns = ({
  staticColumns,
  selectedColumns,
  columnCategories,
  onSave,
  customColumnSettings,
  setCustomColumnSettings,
}: UseColumnsProps) => {
  const customColumns: AvailableColumn[] = React.useMemo(
    () =>
      columnCategories.reduce((columns: AvailableColumn[], category) => {
        category.selectedNodes.forEach(column => {
          if (customColumnSettings.includes(column.id)) {
            columns.push(column);
          }
        });
        return columns;
      }, [] as AvailableColumn[]),
    [columnCategories, customColumnSettings],
  );

  const initialColumnsState = React.useMemo(
    () =>
      [...staticColumns, ...customColumns].filter(
        column => selectedColumns.includes(column.id) || column.id === "empty",
      ),
    [customColumns, staticColumns, selectedColumns],
  );

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

  const onChange = onSave;
  const onCustomColumnSelect = setCustomColumnSettings;

  return {
    handlers: {
      onMove,
      onResize,
      onChange,
      onCustomColumnSelect,
    },
    visibleColumns,
    staticColumns,
    customColumns,
    selectedColumns,
    columnCategories,
    customColumnSettings,
  };
};

export const filterEmptyColumn = (column: AvailableColumn) =>
  column.title !== "";
