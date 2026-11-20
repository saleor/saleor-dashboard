import { defineMessages } from "react-intl";

export const orderVoucherDialogMessages = defineMessages({
  addTitle: {
    id: "jp4DrW",
    defaultMessage: "Add voucher",
    description: "dialog header for adding a voucher to a draft order",
  },
  changeTitle: {
    id: "/w+8gp",
    defaultMessage: "Change voucher",
    description: "dialog header for changing the voucher of a draft order",
  },
  codeLabel: {
    id: "hvCS1h",
    defaultMessage: "Voucher code",
    description: "voucher code input label",
  },
  noResults: {
    id: "Tz0M48",
    defaultMessage: "No active vouchers match your search in this channel.",
    description: "empty state of the voucher code picker",
  },
});
