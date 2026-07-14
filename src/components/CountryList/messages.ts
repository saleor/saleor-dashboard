import { defineMessages } from "react-intl";

export const countryListMessages = defineMessages({
  assignCountries: {
    id: "zZCCqz",
    defaultMessage: "Assign countries",
    description: "button",
  },
  shippingZoneSummary: {
    id: "Jp+4eZ",
    defaultMessage: "{count, plural, one {Delivers to # country} other {Delivers to # countries}}",
    description: "shipping zone country list summary",
  },
  voucherSummary: {
    id: "wswB4s",
    defaultMessage: "{count, plural, one {Valid in # country} other {Valid in # countries}}",
    description: "voucher country list summary",
  },
});
