import { VoucherTypeEnum } from "@dashboard/graphql";
import { defineMessages, IntlShape } from "react-intl";

const messages = defineMessages({
  order: {
    id: "ymo+cm",
    defaultMessage: "All products",
    description: "voucher discount",
  },
  productsAndVariants: {
    defaultMessage: "Specific products and variants",
    id: "PDF+8k",
    description: "voucher discount",
  },
  shipment: {
    id: "WasHjQ",
    defaultMessage: "Shipment",
    description: "voucher discount",
  },
});

export const itemsQuantityMessages = defineMessages({
  categories: {
    id: "ppLwx3",
    defaultMessage: "Categories ({quantity})",
    description: "number of categories",
  },
  collections: {
    id: "QdGzUf",
    defaultMessage: "Collections ({quantity})",
    description: "number of collections",
  },
  products: {
    id: "bNw8PM",
    defaultMessage: "Products ({quantity})",
    description: "number of products",
  },
  variants: {
    id: "HVlMK2",
    defaultMessage: "Variants ({quantity})",
    description: "number of variants",
  },
});

export const translateVoucherTypes = (intl: IntlShape) => ({
  [VoucherTypeEnum.SHIPPING]: intl.formatMessage(messages.shipment),
  [VoucherTypeEnum.ENTIRE_ORDER]: intl.formatMessage(messages.order),
  [VoucherTypeEnum.SPECIFIC_PRODUCT]: intl.formatMessage(messages.productsAndVariants),
});
