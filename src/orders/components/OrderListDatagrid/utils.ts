import { OrderListQuery } from "@dashboard/graphql";
import { OrderListUrlSortField } from "@dashboard/orders/urls";
import { RelayToFlat } from "@dashboard/types";

export function getOrdersRowsLength(
  disabled: boolean,
  orders?: RelayToFlat<OrderListQuery["orders"]>,
  loading?: boolean,
) {
  if (loading) {
    return 1;
  }

  if (orders?.length) {
    return orders.length;
  }

  if (disabled) {
    return 1;
  }

  return 0;
}

export function getColumnMetadata(column: string) {
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
