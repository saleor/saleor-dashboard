import { EditableGridCell, Item } from "@glideapps/glide-data-grid";
import { updateAtIndex } from "@saleor/utils/lists";
import { useCallback, useRef, useState } from "react";

import { AvailableColumn } from "./types";

export interface DatagridChange {
  data: any;
  row: number;
  column: string;
}

export interface DatagridChangeOpts {
  added: number[];
  removed: number[];
  updates: DatagridChange[];
}
export type OnDatagridChange = (opts: DatagridChangeOpts) => void;

function useDatagridChange(
  availableColumns: readonly AvailableColumn[],
  rows: number,
  onChange?: OnDatagridChange,
) {
  const [added, setAdded] = useState<number[]>([]);
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
    (updates: DatagridChange[], added: number[], removed: number[]) => {
      if (onChange) {
        onChange({
          updates,
          removed,
          added,
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
      notify(changes.current, added, removed);
    },
    [availableColumns, notify, added, removed],
  );

  const onRowsRemoved = useCallback(
    (rows: number[]) => {
      const getRowOffset = (row: number) => rows.filter(r => r < row).length;
      const newAdded = added
        .filter(row => !rows.includes(row))
        .map(row => row - getRowOffset(row));
      const newRemoved = [
        ...removed,
        ...rows
          .filter(row => !added.includes(row))
          .map(row => row + removed.filter(r => r <= row).length),
      ];

      setRemoved(newRemoved);
      changes.current = changes.current
        .filter(change => !rows.includes(change.row))
        .map(change => ({
          ...change,
          row: change.row - getRowOffset(change.row),
        }));
      setAdded(newAdded);

      notify(changes.current, newAdded, newRemoved);
    },
    [added, removed, notify],
  );

  const onRowAdded = useCallback(() => {
    const newAdded = [...added, rows - removed.length + added.length];
    setAdded(newAdded);
    notify(changes.current, newAdded, removed);
  }, [added, notify, removed, rows]);

  return {
    added,
    changes,
    removed,
    getChangeIndex,
    onCellEdited,
    onRowsRemoved,
    onRowAdded,
  };
}

export default useDatagridChange;
