import { OrderDetailsFragment_fulfillments_lines } from "@saleor/fragments/types/OrderDetailsFragment";
import {
  OrderDetails_order,
  OrderDetails_order_fulfillments
} from "@saleor/orders/types/OrderDetails";
import { FulfillmentStatus } from "@saleor/types/globalTypes";

import { LineItemOptions } from "./form";

const fulfiledStatuses = [
  FulfillmentStatus.FULFILLED,
  FulfillmentStatus.REFUNDED
];

export const getOrderUnfulfilledLines = (order: OrderDetails_order) =>
  order?.lines.filter(line => line.quantityFulfilled !== line.quantity) || [];

export const getFulfilledFulfillment = fulfillment =>
  fulfiledStatuses.includes(fulfillment.status);

export const getFulfilledFulfillemnts = (order?: OrderDetails_order) =>
  order?.fulfillments.filter(getFulfilledFulfillment) || [];

export const getUnfulfilledLines = (order?: OrderDetails_order) =>
  order?.lines.filter(line => line.quantity !== line.quantityFulfilled) || [];

export const getAllOrderFulfilledLines = (order?: OrderDetails_order) =>
  getFulfilledFulfillemnts(order).reduce(
    (result, { lines }) => [...result, ...getParsedFulfiledLines(lines)],
    []
  );

export function getLineItem<T>(
  { id }: { id: string },
  {
    initialValue,
    isFulfillment = false,
    isRefunded = false
  }: LineItemOptions<T>
) {
  return {
    data: { isFulfillment, isRefunded },
    id,
    label: null,
    value: initialValue
  };
}

export function getParsedLineData<T>({
  initialValue,
  isFulfillment = false,
  isRefunded = false
}: LineItemOptions<T>) {
  return (item: { id: string }) =>
    getLineItem(item, { initialValue, isFulfillment, isRefunded });
}

export function getParsedLineDataForFulfillmentStatus<T>(
  order: OrderDetails_order,
  fulfillmentStatus: FulfillmentStatus,
  lineItemOptions: LineItemOptions<T>
) {
  return getParsedLinesOfFulfillments(
    getFulfillmentsWithStatus(order, fulfillmentStatus)
  ).map(getParsedLineData(lineItemOptions));
}

export const getFulfillmentsWithStatus = (
  order: OrderDetails_order,
  fulfillmentStatus: FulfillmentStatus
) =>
  order?.fulfillments.filter(({ status }) => status === fulfillmentStatus) ||
  [];

export const getParsedLinesOfFulfillments = (
  fullfillments: OrderDetails_order_fulfillments[]
) =>
  fullfillments.reduce(
    (result, { lines }) => [...result, ...getParsedFulfiledLines(lines)],
    []
  );

export const getParsedFulfiledLines = (
  lines: OrderDetailsFragment_fulfillments_lines[]
) =>
  lines.map(({ id, quantity, orderLine }) => ({
    ...orderLine,
    id,
    quantity
  }));

export const getById = (idToCompare: string) => (obj: { id: string }) =>
  obj.id === idToCompare;

export const getByUnmatchingId = (idToCompare: string) => (obj: {
  id: string;
}) => obj.id !== idToCompare;
