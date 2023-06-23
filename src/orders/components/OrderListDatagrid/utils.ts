// @ts-strict-ignore
import { OrderListQuery } from "@dashboard/graphql";
import { OrderListUrlSortField } from "@dashboard/orders/urls";
import { RelayToFlat } from "@dashboard/types";

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
