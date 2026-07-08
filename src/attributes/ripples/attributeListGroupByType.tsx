import { type Ripple } from "@dashboard/ripples/types";
import { Text } from "@saleor/macaw-ui-next";
import { Settings } from "lucide-react";
import { type CSSProperties } from "react";

const settingsIconStyle: CSSProperties = {
  verticalAlign: "text-bottom",
};

const attributeListGroupByTypeContextual = (
  <Text color="default2">
    Turn on <em>Group by type</em> in the view menu{" "}
    <Settings size={16} aria-hidden style={settingsIconStyle} /> to browse attributes by product or
    model type. Your filters stay above the tabs, and you can unassign attributes from a single type
    when one tab is selected.
  </Text>
);

export const rippleAttributeListGroupByType: Ripple = {
  type: "feature",
  ID: "attribute-list-group-by-type",
  TTL_seconds: 60 * 60 * 24 * 7,
  dateAdded: new Date(2026, 6, 7),
  content: {
    oneLiner: "Group attributes by type",
    contextual: attributeListGroupByTypeContextual,
    global:
      "On product and model attribute lists, open the view menu next to Create attribute and choose Group by type. The list adds tabs for each type so you can see which attributes belong to it. Filters and search stay above the tabs. When a single type tab is active, you can unassign selected attributes from that type without deleting them shop-wide.",
  },
};
