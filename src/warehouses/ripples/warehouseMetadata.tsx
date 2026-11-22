import { type Ripple } from "@dashboard/ripples/types";
import { defineMessages } from "react-intl";

const contentMessages = defineMessages({
  oneLiner: {
    id: "B8itX4",
    defaultMessage: "Warehouse metadata editing",
    description: "ripple title",
  },
  contextual: {
    id: "4bO1ML",
    defaultMessage:
      "Warehouse metadata can now be edited via this button which opens a dedicated dialog",
    description: "ripple contextual hint",
  },
  global: {
    id: "56+i8/",
    defaultMessage:
      "You can now edit warehouse metadata through a dedicated dialog, allowing you to manage both public and private metadata for your warehouses.",
    description: "ripple description in What's New",
  },
});

export const rippleWarehouseMetadata: Ripple = {
  type: "feature",
  ID: "warehouse-metadata",
  TTL_seconds: 60 * 60 * 24 * 3, // 3 days
  content: {
    oneLiner: contentMessages.oneLiner,
    contextual: contentMessages.contextual,
    global: contentMessages.global,
  },
  dateAdded: new Date("2026-01-27"),
};
