import { type Ripple } from "@dashboard/ripples/types";
import { Text } from "@saleor/macaw-ui-next";
import { defineMessages, FormattedMessage } from "react-intl";

const messages = defineMessages({
  title: {
    defaultMessage: "Collection full descriptions",
    id: "oa3Bw5",
  },
  contextual: {
    defaultMessage:
      "Add detailed collection content in Full Description. The existing description stays separate.",
    id: "MxJcz6",
  },
  global: {
    defaultMessage:
      "Collections now have a separate Full Description field. For example, keep an introduction in Description and add detailed content in Full Description.",
    id: "AyCQx0",
  },
});

export const rippleCollectionFullDescription: Ripple = {
  type: "feature",
  ID: "collection-full-description",
  TTL_seconds: 60 * 60 * 24 * 7,
  dateAdded: new Date(2026, 9, 15),
  content: {
    oneLiner: messages.title,
    contextual: (
      <Text>
        <FormattedMessage {...messages.contextual} />
      </Text>
    ),
    global: (
      <Text>
        <FormattedMessage {...messages.global} />
      </Text>
    ),
  },
};
