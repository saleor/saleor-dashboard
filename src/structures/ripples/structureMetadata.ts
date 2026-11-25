import { type Ripple } from "@dashboard/ripples/types";
import { defineMessages } from "react-intl";

const contentMessages = defineMessages({
  oneLiner: {
    id: "MJVxKk",
    defaultMessage: "Structure metadata",
    description: "ripple title",
  },
  contextual: {
    id: "P0IDH3",
    defaultMessage: "View and edit this structure's public and private metadata from this button.",
    description: "ripple contextual hint",
  },
  global: {
    id: "2sL7+k",
    defaultMessage:
      "Structure pages now have a header button that opens the structure's metadata, so public and private metadata of navigation structures can be viewed and edited in the dashboard, like on warehouses and models.",
    description: "ripple description in What's New",
  },
});

export const rippleStructureMetadata: Ripple = {
  type: "feature",
  ID: "structure-metadata-header",
  TTL_seconds: 60 * 60 * 24 * 7,
  dateAdded: new Date(2026, 10, 14),
  content: {
    oneLiner: contentMessages.oneLiner,
    contextual: contentMessages.contextual,
    global: contentMessages.global,
  },
};
