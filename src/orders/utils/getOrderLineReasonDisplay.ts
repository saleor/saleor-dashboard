import { type OrderDetailsFragment } from "@dashboard/graphql";

import { type LineReasonDisplay } from "../components/OrderDetailsDatagrid/datagrid";

export const getOrderLineReasonDisplay = (
  order: OrderDetailsFragment,
  orderLineId: string,
): LineReasonDisplay | null => {
  const reasons: LineReasonDisplay[] = [];

  order.fulfillments?.forEach(fulfillment => {
    fulfillment.lines?.forEach(fulfillmentLine => {
      if (fulfillmentLine.orderLine?.id !== orderLineId) {
        return;
      }

      const reason = fulfillmentLine.reason ?? fulfillment.reason ?? null;
      const reasonType =
        fulfillmentLine.reasonReference?.title ?? fulfillment.reasonReference?.title ?? null;

      if (reason || reasonType) {
        reasons.push({ reason, reasonType });
      }
    });
  });

  return reasons.at(-1) ?? null;
};
