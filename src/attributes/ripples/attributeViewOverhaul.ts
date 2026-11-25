import { type Ripple } from "@dashboard/ripples/types";
import { defineMessages } from "react-intl";

const contentMessages = defineMessages({
  oneLiner: {
    id: "SXgidC",
    defaultMessage: "Attribute view overhaul for consistency",
    description: "ripple title",
  },
  contextual: {
    id: "pltmH2",
    defaultMessage:
      "Attribute metadata is now edited from this button, which opens a dedicated dialog.",
    description: "ripple contextual hint",
  },
  global: {
    id: "oO71nw",
    defaultMessage:
      "The attribute detail page now follows the same patterns as other entity views. Metadata is edited from the header, the attribute class appears beside the title, and layout is aligned for a more consistent experience.",
    description: "ripple description in What's New",
  },
});

export const rippleAttributeViewOverhaul: Ripple = {
  type: "improvement",
  ID: "attribute-view-overhaul",
  TTL_seconds: 60 * 60 * 24 * 7,
  dateAdded: new Date(2026, 5, 16),
  content: {
    oneLiner: contentMessages.oneLiner,
    contextual: contentMessages.contextual,
    global: contentMessages.global,
  },
};
