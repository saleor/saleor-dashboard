import { defineMessages } from "react-intl";

export const messages = defineMessages({
  emptyText: {
    id: "RlfqSV",
    defaultMessage: "No orders found",
  },
  addOrder: {
    id: "uoKAmI",
    defaultMessage: "Add new order",
  },
  editOrder: {
    defaultMessage: "Edit order",
    id: "lwjzVj",
  },
  orders: {
    defaultMessage: "Order",
    id: "XPruqs",
  },
});

export const columnsMessages = defineMessages({
  number: {
    id: "kFkPWB",
    defaultMessage: "Number",
  },
  date: {
    id: "P7PLVj",
    defaultMessage: "Date",
  },
  customer: {
    id: "hkENym",
    defaultMessage: "Customer",
  },
  payment: {
    id: "NmK6zy",
    defaultMessage: "Payment",
  },
  status: {
    id: "NWxomz",
    defaultMessage: "Fulfillment status",
  },
  net: {
    id: "rU2b3o",
    defaultMessage: "Net",
    description: "orders list column: net product value (excludes tax and shipping)",
  },
  total: {
    id: "MJ2jZQ",
    defaultMessage: "Total",
  },
  channel: {
    defaultMessage: "Channel",
    id: "KeO51o",
  },
  delivery: {
    defaultMessage: "Delivery",
    id: "ufYgcB",
    description: "orders list column: how the order is delivered (shipping or warehouse pickup)",
  },
  deliveryShipping: {
    defaultMessage: "Shipping",
    id: "NOlC2k",
    description: "orders list tag: order is shipped to the customer by a shipping method",
  },
  deliveryWarehouse: {
    defaultMessage: "Pickup",
    id: "AgdhYN",
    description: "orders list tag: order is picked up by the customer at a warehouse",
  },
});
