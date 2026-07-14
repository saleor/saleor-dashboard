// @ts-strict-ignore
import { type OrderListQuery } from "@dashboard/graphql";
import { OrderListUrlSortField } from "@dashboard/orders/urls";
import { type RelayToFlat } from "@dashboard/types";

export function getOrdersRowsLength(
  orders?: RelayToFlat<OrderListQuery["orders"]>,
  loading?: boolean,
) {
  if (loading) {
    return 1;
  }

  if (orders?.length) {
    return orders.length;
  }

  return 0;
}

export function getColumnNameAndId(column: string): {
  columnName: OrderListUrlSortField;
  columnId?: string;
} {
  if (column.includes(":")) {
    const [columnName, columnId] = column.split(":");

    return {
      columnName: columnName as OrderListUrlSortField,
      columnId,
    };
  }

  return {
    columnName: column as OrderListUrlSortField,
  };
}

export function canBeSorted(sort: OrderListUrlSortField) {
  switch (sort) {
    case OrderListUrlSortField.number:
    case OrderListUrlSortField.date:
    case OrderListUrlSortField.customer:
    case OrderListUrlSortField.payment:
    case OrderListUrlSortField.fulfillment:
      return true;
    default:
      return false;
  }
}

const NET_COLUMN_ID = "net";
const TOTAL_COLUMN_ID = "total";
const CHANNEL_COLUMN_ID = "channel";

/**
 * Column picker prepends newly toggled columns. Keep "net" immediately before
 * "total" (or before "channel" when total is hidden).
 */
export function orderOrderListColumns(columns: string[]): string[] {
  if (!columns.includes(NET_COLUMN_ID)) {
    return columns;
  }

  const withoutNet = columns.filter(columnId => columnId !== NET_COLUMN_ID);
  const insertBeforeIndex = withoutNet.includes(TOTAL_COLUMN_ID)
    ? withoutNet.indexOf(TOTAL_COLUMN_ID)
    : withoutNet.includes(CHANNEL_COLUMN_ID)
      ? withoutNet.indexOf(CHANNEL_COLUMN_ID)
      : withoutNet.length;

  return [
    ...withoutNet.slice(0, insertBeforeIndex),
    NET_COLUMN_ID,
    ...withoutNet.slice(insertBeforeIndex),
  ];
}
