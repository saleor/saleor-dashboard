import useStateFromProps from "@dashboard/hooks/useStateFromProps";
import { addAtIndex, removeAtIndex } from "@dashboard/utils/lists";
import { GridColumn } from "@glideapps/glide-data-grid";
import { useCallback } from "react";

import { AvailableColumn } from "./types";

function useColumns(availableColumns: readonly AvailableColumn[]) {
  const [columns, setColumns] = useStateFromProps(availableColumns);

  const onColumnMoved = useCallback(
    (startIndex: number, endIndex: number): void => {
      setColumns(old =>
        addAtIndex(old[startIndex], removeAtIndex(old, startIndex), endIndex),
      );
    },
    [setColumns],
  );
  const onColumnResize = useCallback(
    (column: GridColumn, newSize: number) =>
      setColumns(prevColumns =>
        prevColumns.map(prevColumn =>
          prevColumn.id === column.id
            ? { ...prevColumn, width: newSize }
            : prevColumn,
        ),
      ),
    [setColumns],
  );

  return {
    columns,
    onColumnMoved,
    onColumnResize,
  };
}

export default useColumns;
