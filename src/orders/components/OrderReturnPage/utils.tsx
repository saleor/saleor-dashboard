import { OrderDetailsFragment_fulfillments_lines } from "@saleor/fragments/types/OrderDetailsFragment";
import { OrderDetails_order } from "@saleor/orders/types/OrderDetails";
import { FulfillmentStatus } from "@saleor/types/globalTypes";

export const getFulfilledFulfillemnts = (order?: OrderDetails_order) =>
  order?.fulfillments.filter(
    fulfillment => fulfillment.status === FulfillmentStatus.FULFILLED
  ) || [];

export const getUnfulfilledLines = (order?: OrderDetails_order) =>
  order?.lines.filter(line => line.quantity !== line.quantityFulfilled) || [];

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
