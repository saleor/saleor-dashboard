import { type Ripple } from "@dashboard/ripples/types";
import { Text } from "@saleor/macaw-ui-next";
import { Settings2 } from "lucide-react";
import { type CSSProperties } from "react";

const settingsIconStyle: CSSProperties = {
  verticalAlign: "text-bottom",
};

const groupedModelTypeTabsContextual = (
  <Text>
    Similar model types can now be grouped into a single tab based on a type name separator. Use the
    dropdown to switch between all grouped types or a single one. You can adjust the way grouping
    works or disable it in the settings{" "}
    <Settings2 size={16} aria-hidden style={settingsIconStyle} />.
  </Text>
);

const groupedModelTypeTabsGlobal = (
  <Text>
    The Models list now groups model types that share a name prefix, such as{" "}
    <em>&ldquo;Storefront — Cart&rdquo;</em> and <em>&ldquo;Storefront — Checkout&rdquo;</em> under
    a single Storefront tab. Use the dropdown to filter by all grouped types or one type, and adjust
    the name separator or turn grouping on or off from the settings control next to the tabs.
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
