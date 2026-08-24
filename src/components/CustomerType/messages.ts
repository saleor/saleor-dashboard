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
  viewCustomerType: {
    id: "FKBNcP",
    defaultMessage: "View {customerTypeName} type",
    description: "customer type chip, opens the customer type settings page",
  },
});
