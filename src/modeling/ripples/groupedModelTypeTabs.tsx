import { type Ripple } from "@dashboard/ripples/types";
import { Text } from "@saleor/macaw-ui-next";
import { Settings2 } from "lucide-react";
import { type CSSProperties, type ReactNode } from "react";
import { defineMessages, FormattedMessage } from "react-intl";

const settingsIconStyle: CSSProperties = {
  verticalAlign: "text-bottom",
};

const contentMessages = defineMessages({
  oneLiner: {
    id: "xH5Y5v",
    defaultMessage: "Model type tabs can group related types",
    description: "ripple title",
  },
  contextual: {
    id: "WYqIKg",
    defaultMessage:
      "Model types whose names contain a configured separator are grouped into one tab. Open the dropdown on a grouped tab to filter by <em>All</em> or a single type. Adjust separators, read how grouping works, or turn it off in the settings {icon}.",
    description: "ripple contextual hint",
  },
  global: {
    id: "SuJJeo",
    defaultMessage:
      "The Models list can group model types by splitting their names at a separator. For example, <em>“Storefront — Cart”</em> and <em>“Storefront — Checkout”</em> appear under one Storefront tab. Letter case is ignored when matching prefixes. Use the tab dropdown to filter by all grouped types or one type, and open settings next to the tabs to change separators or disable grouping.",
    description: "ripple description in What's New",
  },
});

const emphasis = (chunks: ReactNode[]) => <em>{chunks}</em>;

const groupedModelTypeTabsContextual = (
  <Text color="default2">
    <FormattedMessage
      {...contentMessages.contextual}
      values={{
        em: emphasis,
        icon: <Settings2 size={16} aria-hidden style={settingsIconStyle} />,
      }}
    />
  </Text>
);

const groupedModelTypeTabsGlobal = (
  <Text color="default2">
    <FormattedMessage {...contentMessages.global} values={{ em: emphasis }} />
  </Text>
);

export const rippleGroupedModelTypeTabs: Ripple = {
  type: "feature",
  ID: "grouped-model-type-tabs",
  TTL_seconds: 60 * 60 * 24 * 7,
  content: {
    oneLiner: contentMessages.oneLiner,
    contextual: groupedModelTypeTabsContextual,
    global: groupedModelTypeTabsGlobal,
  },
  dateAdded: new Date(2026, 5, 14),
  actions: [],
};
