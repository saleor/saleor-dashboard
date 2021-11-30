import { defineMessages } from "react-intl";

export const messages = defineMessages({
  webhookInformation: {
    defaultMessage: "Webhook Information",
    description: "section header"
  },
  webhookName: {
    defaultMessage: "Webhook Name",
    description: "webhook input label"
  },
  targetUrl: {
    defaultMessage: "Target URL",
    description: "webhook input label"
  },
  secretKey: {
    defaultMessage: "Secret Key",
    description: "webhook input label"
  },
  targetUrlDescription: {
    defaultMessage: "This URL will receive webhook POST requests",
    description: "webhook input help text"
  },
  secretKeyDescription: {
    defaultMessage:
      "secret key is used to create a hash signature with each payload. *optional field",
    description: "webhook input help text"
  }
});
