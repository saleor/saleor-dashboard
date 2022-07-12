import { VoucherTypeEnum } from "@saleor/graphql";
import { defineMessages, IntlShape } from "react-intl";

const messages = defineMessages({
  order: {
    id: "bP7ZLP",
    defaultMessage: "Entire order",
    description: "voucher discount",
  },
  products: {
    id: "45zP+r",
    defaultMessage: "Specific products",
    description: "voucher discount",
  },
  shipment: {
    id: "WasHjQ",
    defaultMessage: "Shipment",
    description: "voucher discount",
  },
});

export const translateVoucherTypes = (intl: IntlShape) => ({
  [VoucherTypeEnum.SHIPPING]: intl.formatMessage(messages.shipment),
  [VoucherTypeEnum.ENTIRE_ORDER]: intl.formatMessage(messages.order),
  [VoucherTypeEnum.SPECIFIC_PRODUCT]: intl.formatMessage(messages.products),
});
