import { defineMessages } from "react-intl";

export const voucherRedemptionsMessages = defineMessages({
  title: {
    id: "X8yh5A",
    defaultMessage: "Redemptions",
    description: "voucher sidebar redemptions card title",
  },
  codesCount: {
    id: "z/lMXM",
    defaultMessage: "{count, plural, one {# code} other {# codes}}",
    description: "voucher redemptions card codes count meta",
  },
  channelsCount: {
    id: "uuPymz",
    defaultMessage: "{count, plural, one {# channel} other {# channels}}",
    description: "voucher redemptions card channels count meta",
  },
  usedOfLimit: {
    id: "AV7GES",
    defaultMessage: "{used} of {limit} used",
    description: "voucher redemptions card used of limit detail line",
  },
  usedUnlimited: {
    id: "AD5gDx",
    defaultMessage: "{used} used · no total cap",
    description: "voucher redemptions card used detail when unlimited",
  },
  remaining: {
    id: "qbT0tS",
    defaultMessage: "{count, plural, one {# redemption left} other {# redemptions left}}",
    description: "voucher redemptions remaining detail line",
  },
  remainingNone: {
    id: "6ImMXG",
    defaultMessage: "No redemptions left",
    description: "voucher redemptions when usage limit is exhausted",
  },
  countingHint: {
    id: "bQCV7I",
    defaultMessage:
      "Counts redemptions across all codes combined, not per code. Draft orders are counted only in channels whose order settings have {settingName} switched on — that is set per channel, so this total can mix both.",
    description: "voucher redemptions counting explanation callout",
  },
  draftOrdersSettingName: {
    id: "V8aQTU",
    defaultMessage: "Include draft orders in voucher usage",
    description: "channel order setting name referenced in redemptions hint",
  },
  redeemableNowUntil: {
    id: "iWLskA",
    defaultMessage: "Redeemable now, until {date}.",
    description: "voucher redemptions schedule status when active with end date",
  },
  redeemableNow: {
    id: "YSi2+b",
    defaultMessage: "Redeemable now.",
    description: "voucher redemptions schedule status when active without end date",
  },
  redeemableFrom: {
    id: "v9qlem",
    defaultMessage: "Redeemable from {date}.",
    description: "voucher redemptions schedule status when not yet started",
  },
  redemptionEnded: {
    id: "0rdBWd",
    defaultMessage: "Redemption window ended {date}.",
    description: "voucher redemptions schedule status when ended",
  },
  constraintsLabel: {
    defaultMessage: "Usage constraints",
    id: "RD29Kd",
    description: "accessible label for voucher redemptions constraint chips",
  },
  constraintStaffOnly: {
    defaultMessage: "Staff only",
    id: "uXa7/n",
    description: "voucher redemptions constraint chip when onlyForStaff is on",
  },
  constraintOncePerCustomer: {
    defaultMessage: "Once per customer",
    id: "InEAQM",
    description: "voucher redemptions constraint chip when applyOncePerCustomer is on",
  },
  constraintSingleUse: {
    defaultMessage: "Single-use codes",
    id: "RiF1QH",
    description: "voucher redemptions constraint chip when singleUse is on",
  },
});
