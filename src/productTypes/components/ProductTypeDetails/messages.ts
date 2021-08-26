import { defineMessages } from "react-intl";

export const messages = defineMessages({
  productTypeName: {
    defaultMessage: "Product Type Name",
    description: "label"
  },
  optionNormalTitle: {
    defaultMessage: "This is a normal product",
    description: "option"
  },
  optionNormalDescription: {
    defaultMessage:
      "This product type can be used to create shipping passes for your customers",
    description: "option description"
  },
  optionGiftCardTitle: {
    defaultMessage: "Products of this type can be used as gift card/voucher",
    description: "option"
  },
  optionGiftCardDescription: {
    defaultMessage:
      "This product type can be used to create voucher/gift card type products that user will be able to pay with during checkout process",
    description: "option description"
  }
});
