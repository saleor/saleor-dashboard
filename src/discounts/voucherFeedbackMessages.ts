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
});
