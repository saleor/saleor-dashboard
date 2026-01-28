import { Ripple } from "@dashboard/ripples/types";

export const rippleWarehouseMetadata: Ripple = {
  type: "feature",
  ID: "warehouse-metadata",
  TTL_seconds: 60 * 60 * 24 * 3, // 3 days
  content: {
    oneLiner: "Warehouse metadata editing",
    contextual:
      "Warehouse metadata can now be edited via this button which opens a dedicated dialog",
    global:
      "You can now edit warehouse metadata through a dedicated dialog, allowing you to manage both public and private metadata for your warehouses.",
  },
  dateAdded: new Date("2026-01-27"),
};
