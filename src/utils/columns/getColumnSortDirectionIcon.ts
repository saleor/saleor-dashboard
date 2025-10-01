import { Sort } from "@dashboard/types";

export function getColumnSortDirectionIcon<T extends string = string>(
  { sort, asc }: Sort<T>,
  columnName: T,
  options?: { nonSortableColumns?: T[] },
) {
  const nonSortableColumns = options?.nonSortableColumns ?? [];

  if (nonSortableColumns.includes(columnName)) {
    return undefined;
  }

  if (columnName === sort) {
    if (asc) {
      return "arrowUp";
    } else {
      return "arrowDown";
    }
  }

  return undefined;
}
