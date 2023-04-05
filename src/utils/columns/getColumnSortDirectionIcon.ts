import { Sort } from "@dashboard/types";

export function getColumnSortDirectionIcon<T extends string = string>(
  { sort, asc }: Sort<T>,
  columnName: T,
) {
  if (columnName === sort) {
    if (asc) {
      return "arrowUp";
    } else {
      return "arrowDown";
    }
  }

  return undefined;
}
