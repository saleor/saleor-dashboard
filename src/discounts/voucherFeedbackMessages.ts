import { defineMessages } from "react-intl";

/** Toast / feedback copy for voucher create, details, and codes actions. */
export const voucherFeedbackMessages = defineMessages({
  voucherUpdated: {
    id: "xceetm",
    defaultMessage: "Voucher updated",
    description: "toast title after voucher save succeeds",
  },
  voucherCreated: {
    id: "zBtMtz",
    defaultMessage: "Voucher created",
    description: "toast title after voucher create succeeds",
  },
  voucherDeleted: {
    id: "3GIhuP",
    defaultMessage: "Voucher deleted",
    description: "toast title after voucher delete succeeds",
  },
  couldNotSaveVoucher: {
    id: "A26ZaZ",
    defaultMessage: "Couldn't save voucher",
    description: "toast title when voucher save fails",
  },
  discountValuesNotSaved: {
    id: "Zc1ydW",
    defaultMessage: "Discount values weren't saved",
    description:
      "toast title when a voucher was created but its channel discount values were rejected",
  },
  addChannelsAndDiscountValues: {
    id: "F7/C6J",
    defaultMessage:
      "The voucher was created without channels. Add them and set its discount values.",
    description:
      "toast description when a voucher was created but its channel discount values were rejected",
  },
  someChangesNotSaved: {
    id: "0VqtEk",
    defaultMessage: "Some changes weren't saved",
    description: "toast title when a voucher save went through only in part",
  },
  tryAgain: {
    id: "IsuaVj",
    defaultMessage: "Try again.",
    description: "toast description when a voucher save request failed without field errors",
  },
  couldNotCreateVoucher: {
    id: "NwA0hL",
    defaultMessage: "Couldn't create voucher",
    description: "toast title when voucher create fails or is blocked",
  },
  couldNotDeleteVoucher: {
    id: "HBLYWs",
    defaultMessage: "Couldn't delete voucher. Try again.",
    description: "toast title when voucher delete fails",
  },
  checkHighlightedFields: {
    id: "vKVMsA",
    defaultMessage: "Check the highlighted fields and try again.",
    description: "toast description pointing merchants to inline field errors",
  },
  addAtLeastOneCode: {
    id: "CsDZaw",
    defaultMessage: "Add at least one code",
    description: "toast description when create is blocked by missing codes",
  },
  assignAtLeastOneChannel: {
    id: "giyyan",
    defaultMessage: "Assign at least one channel",
    description: "toast description when create is blocked by missing channels",
  },
  fixCodesAndTryAgain: {
    id: "GHu/0h",
    defaultMessage: "Fix the codes section and try again.",
    description: "toast description when save fails due to voucher code errors",
  },
  fixCatalogueAndTryAgain: {
    id: "gZ3jPc",
    defaultMessage: "Fix the catalogue section and try again.",
    description: "toast description when save fails due to catalogue assign errors",
  },
  fixCountriesAndTryAgain: {
    id: "z5W3Sk",
    defaultMessage: "Fix the countries section and try again.",
    description: "toast description when save fails due to country assign errors",
  },
  usageLimitMin: {
    id: "oX9wx8",
    defaultMessage: "Enter a limit of at least 1.",
    description: "helper text when usage limit is zero or negative",
  },
  minQuantityMin: {
    id: "Flraxf",
    defaultMessage: "Enter at least 1 item.",
    description: "voucher minimum quantity validation error",
  },
  wholeNumber: {
    id: "UQ+Qf7",
    defaultMessage: "Enter a whole number.",
    description: "helper text when a voucher limit or quantity has a fractional part",
  },
  discountValueNotPositive: {
    id: "+t3Jo2",
    defaultMessage: "Enter more than 0.",
    description: "helper text when a voucher channel discount is zero or negative",
  },
  discountValueAboveHundredPercent: {
    id: "EIDiWC",
    defaultMessage: "Enter 100 or less.",
    description: "helper text when a voucher channel percentage is above 100",
  },
  discountValueTooManyDecimals: {
    id: "oIT4ev",
    defaultMessage: "Use up to 3 decimal places.",
    description: "helper text when a voucher channel percentage has more than 3 decimal places",
  },
  numberTooLarge: {
    defaultMessage: "Enter {max} or less.",
    id: "5q7CTy",
    description: "helper text when a voucher limit or quantity is above the largest allowed number",
  },
  minSpentNegative: {
    defaultMessage: "Enter 0 or more.",
    id: "SYQTSp",
    description: "helper text when a voucher minimum order value is negative",
  },
  incompleteDate: {
    id: "T2NCbZ",
    defaultMessage: "Enter a complete date.",
    description: "helper text when a voucher schedule date input is only partly filled in",
  },
  incompleteTime: {
    id: "KdIY/l",
    defaultMessage: "Enter a complete time.",
    description: "helper text when a voucher schedule time input is only partly filled in",
  },
});
