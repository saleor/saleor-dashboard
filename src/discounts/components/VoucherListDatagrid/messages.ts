import { defineMessages } from "react-intl";

export const columnsMessages = defineMessages({
  name: {
    id: "swKM6Z",
    defaultMessage: "Name",
    description: "voucher list name column",
  },
  status: {
    id: "tzD1Zi",
    defaultMessage: "Status",
    description: "voucher list schedule status column",
  },
  minSpent: {
    id: "tuYPlG",
    defaultMessage: "Min. Spent",
    description: "minimum amount of spent money to activate voucher",
  },
  starts: {
    id: "5u7b3V",
    defaultMessage: "Starts",
    description: "voucher is active from date",
  },
  ends: {
    id: "b6L9n7",
    defaultMessage: "Ends",
    description: "voucher is active until date",
  },
  offer: {
    id: "Nn8H6/",
    defaultMessage: "Offer",
    description: "voucher list discount offer summary column",
  },
  scope: {
    id: "9jdqUn",
    defaultMessage: "Scope",
    description: "voucher list discount scope column",
  },
  redemptions: {
    id: "peYlsZ",
    defaultMessage: "Redemptions",
    description: "voucher list used of limit column",
  },
});

export const messages = defineMessages({
  empty: {
    id: "U2mOqA",
    defaultMessage: "No vouchers found",
  },
  statusActive: {
    id: "EDFd9F",
    defaultMessage: "Active",
    description: "voucher list status when redeemable now",
  },
  statusScheduled: {
    id: "y/e6hl",
    defaultMessage: "Scheduled",
    description: "voucher list status before start date",
  },
  statusEnded: {
    id: "DBuWYc",
    defaultMessage: "Ended",
    description: "voucher list status after end date",
  },
  scopeOrder: {
    id: "9O1Wok",
    defaultMessage: "Entire order",
    description: "voucher list scope for entire-order vouchers",
  },
  scopeProducts: {
    id: "z8gJdj",
    defaultMessage: "Products",
    description: "voucher list scope for specific-product vouchers",
  },
  scopeShippingWorldwide: {
    id: "61tEqb",
    defaultMessage: "Worldwide",
    description: "voucher list scope when free shipping has no country limit",
  },
  scopeShippingCountries: {
    id: "v59gTZ",
    defaultMessage: "{count} countries",
    description: "voucher list scope when free shipping is limited to multiple countries",
  },
  freeShippingOffer: {
    id: "dACMwD",
    defaultMessage: "Free shipping",
    description: "voucher list offer cell for shipping vouchers",
  },
  percentageOffer: {
    id: "FQNvg8",
    defaultMessage: "{value}% off",
    description: "voucher list percentage offer summary",
  },
  variesByChannel: {
    id: "g7VKx6",
    defaultMessage: "Varies by channel",
    description: "voucher list offer when channel amounts differ",
  },
  redemptionsUnlimited: {
    id: "K07PNP",
    defaultMessage: "{used} used · no cap",
    description: "voucher list redemptions when usageLimit is null",
  },
  redemptionsOfLimit: {
    id: "XCSCir",
    defaultMessage: "{used} of {limit}",
    description: "voucher list redemptions used of usage limit",
  },
  codesOnly: {
    id: "MDiqNb",
    defaultMessage: "{count, plural, one {# code} other {# codes}}",
    description: "voucher list codes-count suffix (shown muted next to name)",
  },
});
