import { type Ripple } from "@dashboard/ripples/types";
import { Text } from "@saleor/macaw-ui-next";
import { Settings2 } from "lucide-react";
import { type CSSProperties } from "react";

const settingsIconStyle: CSSProperties = {
  verticalAlign: "text-bottom",
};

const groupedModelTypeTabsContextual = (
  <Text color="default2">
    Model types whose names contain a configured separator are grouped into one tab. Open the
    dropdown on a grouped tab to filter by <em>All</em> or a single type. Adjust separators, read
    how grouping works, or turn it off in the settings{" "}
    <Settings2 size={16} aria-hidden style={settingsIconStyle} />.
  </Text>
);

const groupedModelTypeTabsGlobal = (
  <Text color="default2">
    The Models list can group model types by splitting their names at a separator. For example,{" "}
    <em>&ldquo;Storefront — Cart&rdquo;</em> and <em>&ldquo;Storefront — Checkout&rdquo;</em> appear
    under one Storefront tab. Letter case is ignored when matching prefixes. Use the tab dropdown to
    filter by all grouped types or one type, and open settings next to the tabs to change separators
    or disable grouping.
  </Text>
);

export const rippleGroupedModelTypeTabs: Ripple = {
  type: "feature",
  ID: "grouped-model-type-tabs",
  TTL_seconds: 60 * 60 * 24 * 7,
  content: {
    oneLiner: "Model type tabs can group related types",
    contextual: groupedModelTypeTabsContextual,
    global: groupedModelTypeTabsGlobal,
  },
  dateAdded: new Date(2026, 5, 14),
  actions: [],
};
