import { type Ripple } from "@dashboard/ripples/types";
import { defineMessages } from "react-intl";

const contentMessages = defineMessages({
  oneLiner: {
    id: "SSWEPq",
    defaultMessage: "Collapsible navigation",
    description: "ripple title",
  },
  contextual: {
    id: "gkQrFS",
    defaultMessage: "Shrink the navigation to icons to give your pages more room.",
    description: "ripple contextual hint",
  },
  global: {
    id: "TtuhG4",
    defaultMessage:
      "Collapse the navigation to a slim icon rail to give lists and editors more room. Hover an icon to see its name, and click a section to open its pages. Expand it again with the same button or the keyboard shortcut.",
    description: "ripple description in What's New",
  },
});

export const rippleSidebarCollapse: Ripple = {
  type: "feature",
  ID: "sidebar-collapse",
  TTL_seconds: 60 * 60 * 24 * 7, // 7 days
  dateAdded: new Date(2026, 9, 27),
  content: {
    oneLiner: contentMessages.oneLiner,
    contextual: contentMessages.contextual,
    global: contentMessages.global,
  },
};
