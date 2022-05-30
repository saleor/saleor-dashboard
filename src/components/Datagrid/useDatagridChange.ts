import { EditableGridCell, Item } from "@glideapps/glide-data-grid";
import { updateAtIndex } from "@saleor/utils/lists";
import { useCallback, useMemo, useRef } from "react";

import { AvailableColumn } from "./types";

export interface DatagridChange {
  data: any;
  row: number;
  column: string;
}

function useDatagridChange(availableColumns: readonly AvailableColumn[]) {
  const changes = useRef<DatagridChange[]>([]);
  const getChangeIndex = useCallback(
    (column: string, row: number): number =>
      changes.current.findIndex(
        change => change.column === column && change.row === row
      ),
    []
  );

  const onCellEdited = useCallback(
    ([column, row]: Item, newValue: EditableGridCell): void => {
      const columnId = availableColumns[column].id;
      const existingIndex = getChangeIndex(columnId, row);
      const update = { data: newValue.data, column: columnId, row };
      changes.current =
        existingIndex === -1
          ? [...changes.current, update]
          : updateAtIndex(update, changes.current, existingIndex);
    },
    [availableColumns]
  );

  const output = useMemo(() => ({ changes, getChangeIndex, onCellEdited }), [
    changes,
    getChangeIndex,
    onCellEdited
  ]);

  return output;
}

export default useDatagridChange;
