import { DatagridChange } from "@dashboard/components/Datagrid/useDatagridChange";
import { isCurrentRow } from "@dashboard/products/utils/datagrid";

export function getSkuData(
  data: DatagridChange[],
  currentIndex: number,
  removedIds: number[],
): string | undefined {
  return data.find(
    change =>
      change.column === "sku" &&
      isCurrentRow(change.row, currentIndex, removedIds),
  )?.data;
}
