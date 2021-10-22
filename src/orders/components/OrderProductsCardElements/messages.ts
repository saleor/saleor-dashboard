import { defineMessages } from "react-intl";

export const orderProductsCardElementsMessages = defineMessages({
  unfulfilledVariantDeleted: {
    defaultMessage:
      "This product variant no longer exists. You can fulfill it but be mindful that there are no stocks registered for it.",
    description: "product variant in an unfulfilled order"
  },
  fulfilledVariantDeleted: {
    defaultMessage: "This product variant no longer exists",
    description: "product variant in an fulfilled order"
  }
});
