import { FulfillmentFragment, OrderDetailsFragment } from "@saleor/graphql";
import { OrderFulfillStockInputFormsetData } from "@saleor/orders/utils/data";

import {
  getFulfilledFulfillemnts,
  getUnfulfilledLines,
  getWaitingFulfillments
} from "../OrderReturnPage/utils";

export const hasAnyItemsReplaceable = (order?: OrderDetailsFragment) => {
  if (!order) {
    return false;
  }

  const hasAnyUnfulfilledItems = getUnfulfilledLines(order).length > 0;

  const hasAnyWaitingLines = getWaitingFulfillments(order).length > 0;

  const hasAnyFulfilmentsToReturn = getFulfilledFulfillemnts(order).length > 0;

  return (
    hasAnyUnfulfilledItems || hasAnyFulfilmentsToReturn || hasAnyWaitingLines
  );
};

export interface ConditionalItem {
  shouldExist: boolean;
  item: any;
}

export const filteredConditionalItems = (items: ConditionalItem[]) =>
  items.filter(({ shouldExist }) => shouldExist).map(({ item }) => item);

export const transformFuflillmentLinesToStockInputFormsetData = (
  lines: FulfillmentFragment["lines"],
  warehouseId: string
): OrderFulfillStockInputFormsetData =>
  lines?.map(line => ({
    data: null,
    id: line.id,
    value: [
      {
        quantity: line.quantity,
        warehouse: warehouseId
      }
    ]
  }));
