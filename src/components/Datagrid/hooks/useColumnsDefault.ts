import useStateFromProps from "@dashboard/hooks/useStateFromProps";
import { addAtIndex, removeAtIndex } from "@dashboard/utils/lists";
import { GridColumn } from "@glideapps/glide-data-grid";
import { useCallback, useMemo, useState } from "react";

import { AvailableColumn } from "../types";

export function useColumnsDefault(
  availableColumns: readonly AvailableColumn[],
) {
  const [query, setQuery] = useState("");
  const [displayedColumns, setDisplayedColumns] = useStateFromProps(
    availableColumns.map(({ id }) => id),
  );
  const [columnState, setColumnState] = useStateFromProps(availableColumns);

  const onColumnMoved = useCallback(
    (startIndex: number, endIndex: number): void => {
      setDisplayedColumns(old =>
        addAtIndex(old[startIndex], removeAtIndex(old, startIndex), endIndex),
      );
    },
    [setDisplayedColumns],
  );
  const onColumnResize = useCallback(
    (column: GridColumn, newSize: number) =>
      setColumnState(prevColumns =>
        prevColumns.map(prevColumn =>
          prevColumn.id === column.id
            ? { ...prevColumn, width: newSize }
            : prevColumn,
        ),
      ),
    [setColumnState],
  );
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

  const columns = useMemo(
    () => displayedColumns.map(id => columnState.find(ac => ac.id === id)),
    [displayedColumns, columnState],
  );
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
