import { defineMessages } from "react-intl";

const messages = defineMessages({
  fulfilled: {
    defaultMessage: "Fulfilled",
    description: "order status"
  },
  partiallyFulfilled: {
    defaultMessage: "Partially Fulfilled",
    description: "order status"
  },
  placed: {
    defaultMessage: "Placed",
    description: "order"
  },
  readyToCapture: {
    defaultMessage: "Ready to Capture",
    description: "order status"
  },
  status: {
    defaultMessage: "Order Status"
  },
  unfulfilled: {
    defaultMessage: "Unfulfilled",
    description: "order status"
  }
});

export default messages;
