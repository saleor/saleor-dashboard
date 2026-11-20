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
  voucherLabel: {
    id: "w6VwEw",
    defaultMessage: "Voucher",
    description: "label of the voucher picker in the draft order voucher dialog",
  },
  noResults: {
    id: "Tz0M48",
    defaultMessage: "No active vouchers match your search in this channel.",
    description: "empty state of the voucher code picker",
  },
  unnamedVoucher: {
    id: "t9Ir1W",
    defaultMessage: "Unnamed voucher",
    description: "voucher picker option for a voucher without a name",
  },
  freeShipping: {
    id: "shLDoH",
    defaultMessage: "Free shipping",
    description: "voucher picker option summary for shipping vouchers",
  },
  percentageOff: {
    id: "rAoOl6",
    defaultMessage: "{value}% off",
    description: "voucher picker option summary for percentage vouchers",
  },
  fixedOff: {
    id: "YkuxH+",
    defaultMessage: "{value} off",
    description: "voucher picker option summary for fixed amount vouchers, value is a price",
  },
  changeCode: {
    id: "7ddI1l",
    defaultMessage: "Change",
    description: "link that lets staff pick another code of the chosen voucher",
  },
  noUsableCodes: {
    id: "lkqy2y",
    defaultMessage: "This voucher has no unused codes",
    description: "shown when every code of the chosen voucher is used up or inactive",
  },
  codesLoadFailed: {
    id: "fw8p+t",
    defaultMessage: "Could not load this voucher's codes. Pick the voucher again to retry.",
    description: "shown when loading the codes of the chosen voucher failed",
  },
  enterCodeManually: {
    id: "jarKdD",
    defaultMessage: "Enter code manually",
    description: "link that swaps the voucher picker for a code text field",
  },
  searchVouchers: {
    id: "zYlJxn",
    defaultMessage: "Search vouchers",
    description: "link that swaps the code text field back to the voucher picker",
  },
});
