import { WebhookDetailsQuery } from "@saleor/graphql";
import { getStringOrPlaceholder } from "@saleor/misc";
import { isUnnamed } from "@saleor/webhooks/utils";
import { defineMessages, IntlShape } from "react-intl";

export const messages = defineMessages({
  header: {
    id: "snUby7",
    defaultMessage: "Unnamed Webhook Details",
    description: "header",
  },
  headerNamed: {
    id: "OPtrMg",
    defaultMessage: "{webhookName} Details",
    description: "header",
  },
  headerCreate: {
    id: "Ryh3iR",
    defaultMessage: "Create Webhook",
    description: "header",
  },
});

export const getHeaderTitle = (
  intl: IntlShape,
  webhook?: WebhookDetailsQuery["webhook"],
) => {
  if (!webhook) {
    return intl.formatMessage(messages.headerCreate);
  }
  if (isUnnamed(webhook)) {
    return intl.formatMessage(messages.header);
  }
  return intl.formatMessage(messages.headerNamed, {
    webhookName: getStringOrPlaceholder(webhook?.name),
  });
};
