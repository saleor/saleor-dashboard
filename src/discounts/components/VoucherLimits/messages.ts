import { defineMessages } from "react-intl";

export default defineMessages({
  usageLimitsTitle: {
    id: "pzSF+b",
    defaultMessage: "Usage Limit",
    description: "voucher usage limit, header",
  },
  hasUsageLimit: {
    id: "Qj/3sH",
    defaultMessage: "Limit number of times this discount can be used in total",
    description: "limit voucher",
  },
  usageLimit: {
    id: "s51tHd",
    defaultMessage: "Limit of Uses",
    description: "limit voucher",
  },
  usesLeftCaption: {
    id: "o8S0Ac",
    defaultMessage: "Uses left",
    description: "usage limit uses left caption",
  },
  applyOncePerCustomer: {
    id: "p7GaL2",
    defaultMessage: "One use per customer",
    description: "voucher apply once per customer toggle title",
  },
  applyOncePerCustomerDescription: {
    id: "KysW5s",
    defaultMessage:
      "Each customer account can redeem this voucher only once, no matter which code they use.",
    description: "voucher apply once per customer toggle description",
  },
  onlyForStaff: {
    id: "+jHXT3",
    defaultMessage: "Limit to staff only",
    description: "limit voucher",
  },
  singleUse: {
    id: "Ydfy6M",
    defaultMessage: "One use per code",
    description: "voucher single-use code toggle title",
  },
  singleUseDescription: {
    id: "wMpoVP",
    defaultMessage:
      "Each code can be redeemed only once, then that code is deactivated. Other codes on this voucher stay usable.",
    description: "voucher single-use code toggle description",
  },
  singleUseLockedNotice: {
    defaultMessage: "Can't change this after a code has been used in an order or checkout.",
    id: "Rmm9i1",
    description: "notice when single-use toggle is locked because voucher codes were already used",
  },
  usageLimitLockedNotice: {
    defaultMessage:
      "Can't change the total usage limit after a code has been used in an order or checkout.",
    id: "YZ6Pdq",
    description:
      "notice when usage limit controls are locked because voucher codes were already used",
  },
});
