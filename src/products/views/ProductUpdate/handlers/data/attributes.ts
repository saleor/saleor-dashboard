import { DatagridChange } from "@dashboard/components/Datagrid/useDatagridChange";
import { getColumnAttribute, isCurrentRow } from "@dashboard/products/utils/datagrid";

export function getAttributeData(
  data: DatagridChange[],
  currentIndex: number,
  removedIds: number[],
) {
  return data
    .filter(change => isCurrentRow(change.row, currentIndex, removedIds))
    .filter(byHavingAnyAttribute)
    .map(toAttributeData);
}

function byHavingAnyAttribute(change: DatagridChange): boolean {
  return !!getColumnAttribute(change.column);
}

function toAttributeData(change: DatagridChange) {
  const attributeId = getColumnAttribute(change.column);

  return {
    id: attributeId,
    values: change.data.value.value ? [change.data.value.value] : [],
  };
}
