import { readonlyTextCell } from "@dashboard/components/Datagrid/customCells/cells";
import { type AvailableColumn } from "@dashboard/components/Datagrid/types";
import { type Customer, type Customers } from "@dashboard/customers/types";
import { type CustomerListUrlSortField } from "@dashboard/customers/urls";
import { canBeSorted } from "@dashboard/customers/views/CustomerList/sort";
import { getUserName } from "@dashboard/misc";
import { type Sort } from "@dashboard/types";
import { getColumnSortDirectionIcon } from "@dashboard/utils/columns/getColumnSortDirectionIcon";
import { type GridCell, type Item } from "@glideapps/glide-data-grid";
import { type IntlShape } from "react-intl";

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
    {
      id: "companyName",
      title: intl.formatMessage(columnsMessages.companyName),
      width: 250,
    },
    {
      id: "externalReference",
      title: intl.formatMessage(columnsMessages.externalReference),
      width: 250,
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
    icon: canBeSorted(column.id) ? getColumnSortDirectionIcon(sort, column.id) : undefined,
  }));

export const createGetCellContent =
  ({ customers, columns }: { customers: Customers | undefined; columns: AvailableColumn[] }) =>
  ([column, row]: Item): GridCell => {
    const rowData = customers?.[row];
    const columnId = columns[column]?.id;

    if (!columnId || !rowData) {
      return readonlyTextCell("");
    }

    return readonlyTextCell(cellValueByColumnId[columnId]?.(rowData) ?? "");
  };

const cellValueByColumnId: Record<string, (customer: Customer) => string | undefined | null> = {
  name: customer => getUserName(customer),
  email: customer => customer.email,
  companyName: customer => customer.defaultBillingAddress?.companyName,
  externalReference: customer => customer.externalReference,
  orders: customer => customer.orders?.totalCount?.toString(),
};
