import { getStringOrPlaceholder } from "@saleor/misc";
import { WebhookDetails_webhook } from "@saleor/webhooks/types/WebhookDetails";
import { isUnnamed } from "@saleor/webhooks/utils";
import { IntlShape } from "react-intl";
import { defineMessages } from "react-intl";

export const messages = defineMessages({
  header: {
    defaultMessage: "Unnamed Webhook Details",
    description: "header"
  },
  headerNamed: {
    defaultMessage: "{webhookName} Details",
    description: "header"
  },
  headerCreate: {
    defaultMessage: "Create Webhook",
    description: "header"
  }
});

export const getHeaderTitle = (
  intl: IntlShape,
  webhook?: WebhookDetails_webhook
) => {
  if (!webhook) {
    return intl.formatMessage(messages.headerCreate);
  }
  if (isUnnamed(webhook)) {
    return intl.formatMessage(messages.header);
  }
  return intl.formatMessage(messages.headerNamed, {
    webhookName: getStringOrPlaceholder(webhook?.name)
  });
};
