import { byDuplicates } from "../persistance/byDuplicates";
import { PersistedColumn } from "../persistance/persistedColumn";
import { AvailableColumn } from "../types";
import { isValidColumn } from "./utils";

type VisibleColumn = AvailableColumn | undefined;
type DynamicColumn = AvailableColumn;
type SelectedColumn = string;

const byColumnId = (columnId: string) => (persistedColumn: PersistedColumn) =>
  persistedColumn.identifier() === columnId;

export const visibleWithPersistance = (
  visibleColumns: VisibleColumn[],
  persistedColumns: PersistedColumn[],
) => {
  const validColumns = visibleColumns.filter(isValidColumn);

  if (persistedColumns.length === 0) return validColumns;

  return validColumns.map(column => {
    const persistedColumn = persistedColumns.find(byColumnId(column.id));

    if (persistedColumn) return persistedColumn.mergeWithAvailableColumn(column);

    return column;
  });
};

export const dynamicWithPersistance = (
  dynamicColumns: DynamicColumn[] | null,
  persistedColumns: PersistedColumn[],
) => {
  if (!dynamicColumns) return null;

  const uniqueColumns = dynamicColumns.filter(byDuplicates);

  if (persistedColumns.length === 0) return uniqueColumns;

  const rawColumnIds = persistedColumns.map(persistedColumn => persistedColumn.identifier());

  return uniqueColumns.filter(column => rawColumnIds.includes(column.id));
};

export const selectedWithPersistance = (
  selectedColumns: SelectedColumn[],
  persistedColumns: PersistedColumn[],
) => {
  if (persistedColumns.length === 0) return selectedColumns;

  return persistedColumns.map(column => column.identifier());
};
