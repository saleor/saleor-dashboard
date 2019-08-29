import { defineMessages, IntlShape } from "react-intl";

import { VoucherTypeEnum } from "../types/globalTypes";

const messages = defineMessages({
  order: {
    defaultMessage: "Entire order",
    description: "voucher discount"
  },
  products: {
    defaultMessage: "Specific products",
    description: "voucher discount"
  },
  shipment: {
    defaultMessage: "Shipment",
    description: "voucher discount"
  }
});

export const translateVoucherTypes = (intl: IntlShape) => ({
  [VoucherTypeEnum.SHIPPING]: intl.formatMessage(messages.shipment),
  [VoucherTypeEnum.ENTIRE_ORDER]: intl.formatMessage(messages.order),
  [VoucherTypeEnum.SPECIFIC_PRODUCT]: intl.formatMessage(messages.products)
});
