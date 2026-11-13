import { type Ripple } from "@dashboard/ripples/types";
import { Text } from "@saleor/macaw-ui-next";
import { FormattedMessage } from "react-intl";

const typePageCreateAttributeContextual = (
  <Text color="default2">
    <FormattedMessage
      id="PMEkWs"
      defaultMessage="Choose {createAttribute} here to add one and assign it to this type without leaving the page."
      values={{
        createAttribute: (
          <em>
            <FormattedMessage id="gVvUAE" defaultMessage="Create attribute" />
          </em>
        ),
      }}
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
