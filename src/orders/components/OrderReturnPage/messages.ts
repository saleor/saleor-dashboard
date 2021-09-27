import { defineMessages } from "react-intl";

export const OrderReturnPageMessages = defineMessages({
  appTitle: {
    defaultMessage: "Order #{orderNumber}",
    description: "page header with order number"
  },
  pageTitle: {
    defaultMessage: "Order no. {orderNumber} - Replace/Return",
    description: "page header"
  }
});

export const ReturnItemCardMessages = defineMessages({
  improperValue: {
    defaultMessage: "Improper value",
    description: "error message"
  },

  titleFulfilled: {
    defaultMessage: "Fulfillment - #{fulfilmentId}",
    description: "section header"
  },
  titleUnfulfilled: {
    defaultMessage: "Unfulfilled Items",
    description: "section header"
  },
  deletedVariant: {
    defaultMessage:
      "This product is no longer in the database. It won’t be restocked.",
    description: "status badge description on deleted variants"
  }
});
