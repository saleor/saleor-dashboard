import { addAtIndex, removeAtIndex } from "@dashboard/utils/lists";
import { GridColumn } from "@glideapps/glide-data-grid";
import { useCallback, useEffect, useMemo, useState } from "react";

import { AvailableColumn } from "./types";

function useColumns(
  availableColumns: readonly AvailableColumn[],
  hasCustomColumnPicker?: boolean,
) {
  const [query, setQuery] = useState("");
  const [displayedColumns, setDisplayedColumns] = useState(
    availableColumns.map(({ id }) => id),
  );
  const [columnState, setColumnState] = useState(availableColumns);

  useEffect(() => {
    setColumnState(availableColumns);
    setDisplayedColumns(availableColumns.map(({ id }) => id));
  }, [availableColumns]);

  const onColumnMoved = useCallback(
    (startIndex: number, endIndex: number): void => {
      setDisplayedColumns(old =>
        addAtIndex(old[startIndex], removeAtIndex(old, startIndex), endIndex),
      );
    },
    [],
  );
  const onColumnResize = useCallback((column: GridColumn, newSize: number) => {
    if (column.id === "empty") {
      return;
    }

    setColumnState(prevColumns =>
      prevColumns.map(prevColumn =>
        prevColumn.id === column.id
          ? { ...prevColumn, width: newSize }
          : prevColumn,
      ),
    );
  }, []);
  const onColumnsChange = useCallback(
    (picked: string[]) =>
      setDisplayedColumns(prevColumns => [
        ...prevColumns.filter(column => picked.includes(column)),
        ...picked
          .filter(column => !prevColumns.find(c => c === column))
          .map(column => availableColumns.find(ac => ac.id === column).id),
      ]),
    [availableColumns, setDisplayedColumns],
  );

  const columns = useMemo(() => {
    // Prevent errors when availableColumns change
    // but displayedColumns stay old because useEffect fire setState after component render
    if (
      displayedColumns.length !== availableColumns.length &&
      hasCustomColumnPicker
    ) {
      return availableColumns;
    }
    return displayedColumns.map(id => columnState.find(ac => ac.id === id));
  }, [displayedColumns, availableColumns, hasCustomColumnPicker, columnState]);

  const columnChoices = useMemo(
    () =>
      columns.map(({ id, title }) => ({
        label: title,
        value: id,
      })),
    [columns],
  );

  const availableColumnsChoices = useMemo(
    () =>
      availableColumns.map(({ id, title }) => ({
        label: title,
        value: id,
      })),
    [availableColumns],
  );

  const defaultColumns = useMemo(
    () => availableColumns.map(({ id }) => id),
    [availableColumns],
  );

  return {
    availableColumnsChoices,
    columns,
    columnChoices,
    defaultColumns,
    displayedColumns,
    onColumnMoved,
    onColumnResize,
    onColumnsChange,
    picker: {
      query,
      setQuery,
    },
  };
}

export default useColumns;
