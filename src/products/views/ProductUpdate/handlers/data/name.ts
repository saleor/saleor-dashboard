import { DatagridChange } from "@dashboard/components/Datagrid/hooks/useDatagridChange";
import { isCurrentRow } from "@dashboard/products/utils/datagrid";

export function getNameData(data: DatagridChange[], currentIndex: number): string | undefined {
  return data.find(change => change.column === "name" && isCurrentRow(change.row, currentIndex))
    ?.data;
}
