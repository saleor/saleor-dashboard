import { OrderDetails_order } from "@saleor/orders/types/OrderDetails";
import { FulfillmentStatus } from "@saleor/types/globalTypes";

export const getFulfilledFulfillemnts = (order?: OrderDetails_order) =>
  order?.fulfillments.filter(
    fulfillment => fulfillment.status === FulfillmentStatus.FULFILLED
  ) || [];

export const getById = (idToCompare: string) => (obj: { id: string }) =>
  obj.id === idToCompare;
