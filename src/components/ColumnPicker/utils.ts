import { AvailableColumn } from "../Datagrid/types";

export const filterEmptyColumn = (column: AvailableColumn) =>
  column.title !== "";
