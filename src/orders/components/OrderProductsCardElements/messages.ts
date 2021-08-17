import { defineMessages } from "react-intl";

export const messages = defineMessages({
  unfulfilledVariantDeleted: {
    defaultMessage:
      "This product variant cannot be fulfilled because it no longer exists",
    description: "product variant in an unfulfilled order"
  },
  fulfilledVariantDeleted: {
    defaultMessage: "This product variant no longer exists",
    description: "product variant in an fulfilled order"
  }
});
