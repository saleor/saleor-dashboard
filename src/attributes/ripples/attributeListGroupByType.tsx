import { type Ripple } from "@dashboard/ripples/types";
import { Text } from "@saleor/macaw-ui-next";
import { Settings } from "lucide-react";
import { type CSSProperties, type ReactNode } from "react";
import { defineMessages, FormattedMessage } from "react-intl";

const settingsIconStyle: CSSProperties = {
  verticalAlign: "text-bottom",
};

const contentMessages = defineMessages({
  oneLiner: {
    id: "X2DHqo",
    defaultMessage: "Group attributes by type",
    description: "ripple title",
  },
  contextual: {
    id: "mz/fT/",
    defaultMessage:
      "Product and model attribute lists are grouped by type. Use the tabs to browse attributes per type, or turn off <em>Group by type</em> in the view menu {icon}. Your filters stay above the tabs, and you can unassign attributes from a single type when one tab is selected.",
    description: "ripple contextual hint",
  },
  global: {
    id: "zZl3X5",
    defaultMessage:
      "On product and model attribute lists, attributes are grouped by type with tabs for each type. Filters and search stay above the tabs. When a single type tab is active, you can unassign selected attributes from that type without deleting them shop-wide. Turn off Group by type in the view menu next to Create attribute if you prefer the flat list.",
    description: "ripple description in What's New",
  },
});

const attributeListGroupByTypeContextual = (
  <Text color="default2">
    <FormattedMessage
      {...contentMessages.contextual}
      values={{
        em: (chunks: ReactNode[]) => <em>{chunks}</em>,
        icon: <Settings size={16} aria-hidden style={settingsIconStyle} />,
      }}
    />
  </Text>
);

export const rippleAttributeListGroupByType: Ripple = {
  type: "feature",
  ID: "attribute-list-group-by-type",
  TTL_seconds: 60 * 60 * 24 * 7,
  dateAdded: new Date(2026, 6, 7),
  content: {
    oneLiner: contentMessages.oneLiner,
    contextual: attributeListGroupByTypeContextual,
    global: contentMessages.global,
  },
};
