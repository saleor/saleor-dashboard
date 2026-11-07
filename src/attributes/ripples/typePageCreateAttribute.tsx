import { type Ripple } from "@dashboard/ripples/types";
import { Text } from "@saleor/macaw-ui-next";
import { FormattedMessage } from "react-intl";

const typePageCreateAttributeContextual = (
  <Text color="default2">
    <FormattedMessage id="dsGto6" defaultMessage="Choose " />
    <em>
      <FormattedMessage id="gVvUAE" defaultMessage="Create attribute" />
    </em>
    <FormattedMessage
      id="rlVejK"
      defaultMessage=" here to add one and assign it to this type without leaving the page."
    />
  </Text>
);

export const rippleTypePageCreateAttribute: Ripple = {
  type: "feature",
  ID: "type-page-create-attribute",
  TTL_seconds: 60 * 60 * 24 * 7,
  dateAdded: new Date(2026, 6, 8),
  content: {
    oneLiner: "Create attributes on type pages",
    contextual: typePageCreateAttributeContextual,
    global:
      "On product and model type pages, open the menu beside Assign attribute and choose Create attribute. Complete the short wizard and the new attribute is created and linked to that type automatically—no trip to the Attributes section required.",
  },
};
