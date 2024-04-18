import { readonlyTextCell } from "@dashboard/components/Datagrid/customCells/cells";
import { AvailableColumn } from "@dashboard/components/Datagrid/types";
import { Customers } from "@dashboard/customers/types";
import { CustomerListUrlSortField } from "@dashboard/customers/urls";
import { getUserName } from "@dashboard/misc";
import { Sort } from "@dashboard/types";
import { getColumnSortDirectionIcon } from "@dashboard/utils/columns/getColumnSortDirectionIcon";
import { GridCell, Item } from "@glideapps/glide-data-grid";
import { IntlShape } from "react-intl";

import { columnsMessages } from "./messages";

export const customerListStaticColumnsAdapter = (
  intl: IntlShape,
  sort: Sort<CustomerListUrlSortField>,
  includeOrders: boolean,
): AvailableColumn[] =>
  [
    {
      id: "name",
      title: intl.formatMessage(columnsMessages.name),
      width: 450,
    },
    {
      id: "email",
      title: intl.formatMessage(columnsMessages.email),
      width: 450,
    },
    ...(includeOrders
      ? [
          {
            id: "orders",
            title: intl.formatMessage(columnsMessages.orders),
            width: 200,
          },
        ]
      : []),
  ].map(column => ({
    ...column,
    icon: getColumnSortDirectionIcon(sort, column.id),
  }));

export const createGetCellContent =
  ({ customers, columns }: { customers: Customers | undefined; columns: AvailableColumn[] }) =>
  ([column, row]: Item): GridCell => {
    const rowData = customers?.[row];
    const columnId = columns[column]?.id;

    if (!columnId || !rowData) {
      return readonlyTextCell("");
    }

    switch (columnId) {
      case "name":
        return readonlyTextCell(getUserName(rowData) ?? "");
      case "email":
        return readonlyTextCell(rowData?.email ?? "");
      case "orders":
        return readonlyTextCell(rowData?.orders?.totalCount?.toString() ?? "");
      default:
        return readonlyTextCell("");
    }
  };
