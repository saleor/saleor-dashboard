import { type Ripple } from "@dashboard/ripples/types";

export const rippleModelMetadata: Ripple = {
  type: "improvement",
  ID: "model-metadata-header",
  TTL_seconds: 60 * 60 * 24 * 7,
  dateAdded: new Date(2026, 5, 12),
  content: {
    oneLiner: "Model metadata in header",
    contextual: "Model metadata is now edited from this button, which opens a dedicated dialog.",
    global:
      "Model metadata has moved from the bottom of the model page into a header button that opens a dedicated dialog. Public and private metadata are easier to find and edit without scrolling past other sections.",
  },
};
