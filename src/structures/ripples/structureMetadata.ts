import { type Ripple } from "@dashboard/ripples/types";

export const rippleStructureMetadata: Ripple = {
  type: "feature",
  ID: "structure-metadata-header",
  TTL_seconds: 60 * 60 * 24 * 7,
  dateAdded: new Date(2026, 10, 14),
  content: {
    oneLiner: "Structure metadata",
    contextual: "View and edit this structure's public and private metadata from this button.",
    global:
      "Structure pages now have a header button that opens the structure's metadata, so public and private metadata of navigation structures can be viewed and edited in the dashboard, like on warehouses and models.",
  },
};
