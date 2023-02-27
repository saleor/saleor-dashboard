import { isUnnamed } from "@dashboard/custom-apps/utils";
import { WebhookDetailsQuery } from "@dashboard/graphql";
import { getStringOrPlaceholder } from "@dashboard/misc";
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

export const getHeaderTitle = (intl: IntlShape, webhook?: WebhookDetailsQuery["webhook"]) => {
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
