import { type Ripple } from "@dashboard/ripples/types";
import { Text } from "@saleor/macaw-ui-next";
import { defineMessages, FormattedMessage } from "react-intl";

const messages = defineMessages({
  title: {
    defaultMessage: "Category full descriptions",
    id: "E+9QV7",
  },
  contextual: {
    defaultMessage:
      "Add detailed category content in Full Description. The existing description stays separate.",
    id: "Vmla01",
  },
  global: {
    defaultMessage:
      "Categories now have a separate Full Description field. For example, keep an introduction in Description and add detailed content in Full Description.",
    id: "A9y531",
  },
});

export const rippleCategoryFullDescription: Ripple = {
  type: "feature",
  ID: "category-full-description",
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
