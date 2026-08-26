// @ts-strict-ignore
import { type DataEditorProps } from "@glideapps/glide-data-grid";

export const preventRowClickOnSelectionCheckbox = (
  rowMarkers: DataEditorProps["rowMarkers"],
  location: number,
) => !["number", "none"].includes(rowMarkers) && location === -1;

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
): string[] => rows.map(row => items?.[row]?.id).filter((id): id is string => id !== undefined);
