import { defineMessages } from "react-intl";

export const messages = defineMessages({
  webhookStatus: {
    defaultMessage: "Webhook Status",
    description: "section header"
  },
  webhookActive: {
    defaultMessage: "Webhook is active",
    description: "webhooks active label"
  },
  webhookActiveDescription: {
    defaultMessage:
      "If you want to disable this webhook please uncheck the box below.",
    description: "webhook active description"
  }
});
