import { defineMessages } from "react-intl";

export const messages = defineMessages({
  sectionCheckoutTitle: {
    defaultMessage: "Checkout Configuration",
    description: "section title"
  },
  sectionCheckoutDescription: {
    defaultMessage:
      "You can set basic checkout rules that will be applied globally to all your channels",
    description: "section description"
  },
  sectionCompanyTitle: {
    defaultMessage: "Company Information",
    description: "section title"
  },
  sectionCompanyDescription: {
    defaultMessage:
      "This address will be used to generate invoices and calculate shipping rates. Email address you provide here will be used as a contact address for your customers.",
    description: "section description"
  }
});
