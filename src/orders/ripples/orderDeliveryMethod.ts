import { type Ripple } from "@dashboard/ripples/types";

export const rippleOrderDeliveryMethod: Ripple = {
  type: "improvement",
  ID: "order-delivery-method",
  TTL_seconds: 60 * 60 * 24 * 7,
  dateAdded: new Date(2026, 8, 6),
  content: {
    oneLiner: "Order delivery method tags (Shipping / Pickup)",
    contextual:
      "Orders now show how they will be fulfilled: a Shipping or Pickup tag in the order list and in the order header.",
    global:
      "Orders can now be told apart by how they will be fulfilled. The order list has a new Delivery column and the order header shows a matching tag: Shipping for orders delivered via a shipping method, Pickup for orders fulfilled from a warehouse (click & collect). Orders without a delivery method, such as digital products, show a dash in the list.",
  },
};
