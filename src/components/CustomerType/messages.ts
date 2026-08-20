import { defineMessages } from "react-intl";

export const messages = defineMessages({
  customerTypeLabel: {
    id: "pKywOt",
    defaultMessage: "Customer type",
    description: "customer type a11y label prefix",
  },
  viewCustomersOfCustomerType: {
    id: "GGKINk",
    defaultMessage: "View customers of {customerTypeName}",
    description: "customer type scope link in customer header, opens filtered customer list",
  },
  customerTypeListFilterUnavailable: {
    id: "zFVruN",
    defaultMessage:
      "Cannot open a filtered customer list for this type. Use the type card to open customer type settings.",
    description:
      "tooltip on customer type label in header when slug is missing and list filter link is unavailable",
  },
});
