import { EditableGridCell, Item } from "@glideapps/glide-data-grid";
import { updateAtIndex } from "@saleor/utils/lists";
import { useCallback, useRef, useState } from "react";

import { AvailableColumn } from "./types";

export interface DatagridChange {
  data: any;
  row: number;
  column: string;
}

export type OnDatagridChange = (opts: {
  removed: number[];
  updates: DatagridChange[];
}) => void;

function useDatagridChange(
  availableColumns: readonly AvailableColumn[],
  onChange?: OnDatagridChange,
) {
  const [removed, setRemoved] = useState<number[]>([]);
  const changes = useRef<DatagridChange[]>([]);
  const getChangeIndex = useCallback(
    (column: string, row: number): number =>
      changes.current.findIndex(
        change => change.column === column && change.row === row,
      ),
    [],
  );

  const notify = useCallback(
    (updates: DatagridChange[], removed: number[]) => {
      if (onChange) {
        onChange({
          updates,
          removed,
        });
      }
    },
    [onChange],
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
      notify(changes.current, removed);
    },
    [availableColumns, notify, removed],
  );

  const onRowsRemoved = useCallback(
    (rows: number[]) => {
      const getRowOffset = (row: number) => removed.filter(r => r < row).length;
      const newRemoved = [
        ...removed,
        ...rows.map(row => row + getRowOffset(row)),
      ];

      setRemoved(newRemoved);
      changes.current = changes.current
        .filter(change => !rows.includes(change.row))
        .map(change => ({
          ...change,
          row: change.row - getRowOffset(change.row),
        }));

      notify(changes.current, newRemoved);
    },
    [removed, notify],
  );

  return { changes, removed, getChangeIndex, onCellEdited, onRowsRemoved };
}

export default useDatagridChange;
