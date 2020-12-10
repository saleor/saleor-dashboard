import { OrderDetailsFragment_fulfillments_lines } from "@saleor/fragments/types/OrderDetailsFragment";
import { OrderDetails_order } from "@saleor/orders/types/OrderDetails";
import { FulfillmentStatus } from "@saleor/types/globalTypes";

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
