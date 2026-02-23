import { defineMessages } from "react-intl";

export const messages = defineMessages({
  sectionCheckoutTitle: {
    id: "DASYUF",
    defaultMessage: "Checkout Configuration",
    description: "section title",
  },
  sectionCheckoutDescription: {
    id: "Av74Fa",
    defaultMessage:
      "You can set basic checkout rules that will be applied globally to all your channels",
    description: "section description",
  },
  sectionCompanyTitle: {
    id: "rPX1f2",
    defaultMessage: "Company Information",
    description: "section title",
  },
  sectionCompanyDescription: {
    id: "pRYGUR",
    defaultMessage:
      "This address will be used to generate invoices and calculate shipping rates. Email address you provide here will be used as a contact address for your customers.",
    description: "section description",
  },
  sectionEmailConfirmationTitle: {
    id: "qNeXG1",
    defaultMessage: "User registration",
    description: "User registration",
  },
  sectionEmailConfirmationHeader: {
    id: "kpRxSA",
    defaultMessage: "Require email confirmation link",
    description: "Require email confirmation link",
  },
  sectionEmailConfirmationOption: {
    id: "uRfta0",
    defaultMessage: "Enable email confirmation",
    description: "Enable email confirmation",
  },
  sectionEmailConfirmationDescription: {
    id: "/xJSe8",
    defaultMessage:
      "When users confirm their email account, all previous anonymous orders placed under the same email would be added to their order history.",
    description:
      "When users confirm their email account, all previous anonymous orders placed under the same email would be added to their order history.",
  },
  sectionWebhookEmissionTitle: {
    id: "R8+DNv",
    defaultMessage: "Webhook emission",
    description: "section title",
  },
  sectionWebhookEmissionDescription: {
    id: "GK6pQa",
    defaultMessage:
      "When enabled, update webhooks (e.g. customerUpdated) are sent even when only metadata changes. When disabled, only metadata-specific webhooks are sent. This legacy behavior will be removed in a future version.",
    description: "section description",
  },
  sectionWebhookEmissionHeader: {
    id: "0g0LHg",
    defaultMessage: "Emit update webhooks for metadata changes",
    description: "card header and checkbox label",
  },
  sectionAddressValidationTitle: {
    id: "6vf8AS",
    defaultMessage: "Address Validation",
    description: "section title",
  },
  sectionAddressValidationDescription: {
    id: "PJGv35",
    defaultMessage:
      "Controls how address fields that are not part of a country's standard format are handled. By default, such fields are removed during validation — enabling this setting preserves them as entered.",
    description: "section description",
  },
  sectionAddressValidationHeader: {
    id: "4k38A6",
    defaultMessage: "Preserve non-standard address fields",
    description: "card header and checkbox label",
  },
});
