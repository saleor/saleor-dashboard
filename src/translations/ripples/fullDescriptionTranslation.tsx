import { type Ripple } from "@dashboard/ripples/types";
import { Text } from "@saleor/macaw-ui-next";
import { defineMessages, FormattedMessage } from "react-intl";

const messages = defineMessages({
  title: {
    defaultMessage: "Full description translations",
    id: "ira4iG",
  },
  contextual: {
    defaultMessage:
      "Translate full descriptions for categories and collections. Existing description translations stay separate.",
    id: "0H1iBF",
  },
  global: {
    defaultMessage:
      "Category and collection translations now include Full Description. Translate this field on its own or with other fields in bulk edit. The original text and existing Description translation stay separate.",
    id: "GyI/0N",
  },
});

export const rippleFullDescriptionTranslation: Ripple = {
  type: "feature",
  ID: "full-description-translation",
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
