import { defineMessages } from "react-intl";

export const messages = defineMessages({
  webhookInformation: {
    id: "WDy0tF",
    defaultMessage: "Webhook Information",
    description: "section header",
  },
  webhookName: {
    id: "D0KaT6",
    defaultMessage: "Webhook Name",
    description: "webhook input label",
  },
  targetUrl: {
    id: "u9/vj9",
    defaultMessage: "Target URL",
    description: "webhook input label",
  },
  secretKey: {
    id: "NPfmdK",
    defaultMessage: "Secret Key",
    description: "webhook input label",
  },
  targetUrlDescription: {
    id: "0MetrR",
    defaultMessage: "This URL will receive webhook POST requests",
    description: "webhook input help text",
  },
  secretKeyDescription: {
    id: "tA5HJx",
    defaultMessage:
      "secret key is used to create a hash signature with each payload. *optional field",
    description: "webhook input help text",
  },
  useSignature: {
    id: "0kPdlb",
    defaultMessage: "Use RS256 signature instead.",
    description: "deprecated secret key toolbar label",
  },
  learnMore: {
    id: "hnRRUe",
    defaultMessage: "Learn more...",
    description: "docs link label",
  },
});
