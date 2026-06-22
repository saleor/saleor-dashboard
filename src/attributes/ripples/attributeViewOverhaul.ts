import { type Ripple } from "@dashboard/ripples/types";

export const rippleAttributeViewOverhaul: Ripple = {
  type: "improvement",
  ID: "attribute-view-overhaul",
  TTL_seconds: 60 * 60 * 24 * 7,
  dateAdded: new Date(2026, 5, 16),
  content: {
    oneLiner: "Attribute view overhaul for consistency",
    contextual:
      "Attribute metadata is now edited from this button, which opens a dedicated dialog.",
    global:
      "The attribute detail page now follows the same patterns as other entity views. Metadata is edited from the header, the attribute class appears beside the title, and layout is aligned for a more consistent experience.",
  },
};
