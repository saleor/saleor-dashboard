import { type Ripple } from "@dashboard/ripples/types";
import { defineMessages } from "react-intl";

const contentMessages = defineMessages({
  oneLiner: {
    id: "incIBR",
    defaultMessage: "Shipping or Pickup on orders",
    description: "ripple title",
  },
  contextual: {
    id: "eC0Zlz",
    defaultMessage:
      "Orders show whether they are Shipping or Pickup. The orders list has a Delivery column. A pickup order shows the collection point in the summary and a Pickup location section in the customer card.",
    description: "ripple contextual hint",
  },
  global: {
    id: "P5t/Lx",
    defaultMessage:
      "You can tell orders apart by how they will be fulfilled. The orders list has a Delivery column: Shipping for a shipping method, Pickup for collection at a warehouse (click & collect), or a dash when no delivery method is set. On the order page, a pickup order shows Pickup with the collection point in the summary, and a Pickup location section in the customer card. The warehouses list marks locations customers can collect from.",
    description: "ripple description in What's New",
  },
});

export const rippleOrderDeliveryMethod: Ripple = {
  type: "improvement",
  ID: "order-delivery-method",
  TTL_seconds: 60 * 60 * 24 * 7,
  dateAdded: new Date(2026, 8, 6),
  content: {
    oneLiner: contentMessages.oneLiner,
    contextual: contentMessages.contextual,
    global: contentMessages.global,
  },
};
