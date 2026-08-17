import { defineMessages } from "react-intl";

export const voucherDetailsTitleMessages = defineMessages({
  freeShipping: {
    id: "G4lYrt",
    defaultMessage: "Free shipping",
    description: "voucher type pill in header",
  },
  scopeAmount: {
    defaultMessage: "{scope} · {amount}",
    description: "voucher type pill combining discount scope and amount type",
    id: "GoSeIN",
  },
  scopeEntireOrder: {
    defaultMessage: "Entire order",
    description: "voucher type pill scope: entire order",
    id: "31IkHD",
  },
  scopeProducts: {
    defaultMessage: "Products",
    description: "voucher type pill scope: specific products",
    id: "FBIsuH",
  },
  amountPercentage: {
    defaultMessage: "%",
    description: "voucher type pill amount type: percentage",
    id: "kPbIlj",
  },
  amountFixed: {
    defaultMessage: "Fixed",
    description: "voucher type pill amount type: fixed",
    id: "qqCv2r",
  },
  statusScheduled: {
    defaultMessage: "Scheduled",
    id: "cXAlMR",
  },
  statusInactive: {
    defaultMessage: "Inactive",
    id: "6Tps09",
  },
  statusActive: {
    defaultMessage: "Active",
    id: "3a5wL8",
  },
});
