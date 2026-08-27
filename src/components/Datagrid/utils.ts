// @ts-strict-ignore
import {
  CompactSelection,
  type DataEditorProps,
  type GridSelection,
} from "@glideapps/glide-data-grid";

export const preventRowClickOnSelectionCheckbox = (
  rowMarkers: DataEditorProps["rowMarkers"],
  location: number,
) => !["number", "none"].includes(rowMarkers) && location === -1;

export interface VisibleGridSelection {
  visibleRows: number[];
  /** Present only when the selection still holds rows (or a current cell) past `rowsTotal`. */
  prunedSelection?: GridSelection;
}

/**
 * Splits a Glide selection into the indices that still exist and, when needed,
 * a rewritten selection with the dead ones removed.
 *
 * Callers must not apply `prunedSelection` while the grid is showing a loading
 * placeholder (`getProductRowsLength` returns 1). That would permanently drop a
 * real selection that should come back when the list resolves.
 */
export const getVisibleGridSelection = (
  selection: GridSelection,
  rowsTotal: number,
): VisibleGridSelection => {
  const selectedRows = Array.from(selection.rows);
  const visibleRows = selectedRows.filter(row => row < rowsTotal);
  const currentRow = selection.current?.cell[1];
  const currentOutOfRange = currentRow !== undefined && currentRow >= rowsTotal;

  if (visibleRows.length === selectedRows.length && !currentOutOfRange) {
    return { visibleRows };
  }

  const prunedSelection: GridSelection = {
    ...selection,
    rows: visibleRows.reduce((acc, row) => acc.add(row), CompactSelection.empty()),
    current: currentOutOfRange ? undefined : selection.current,
  };

  return { visibleRows, prunedSelection };
};

/**
 * Resolves selected datagrid row indices to entity ids.
 *
 * Glide tracks its row selection by index, independently of the data behind the
 * grid, so a selection made before the list shrank — rows per page lowered, a bulk
 * delete, a refetch returning fewer records — can still carry indices that no
 * longer point at a row. Reading `.id` off those directly throws and takes the
 * whole view down, so unresolved indices are dropped instead.
 */
export const getRowIdsFromSelection = <T extends { id: string }>(
  rows: number[],
  items: readonly T[] | undefined | null,
): string[] =>
  rows
    .map(row => items?.[row]?.id)
    .filter((id): id is string => typeof id === "string" && id.length > 0);
