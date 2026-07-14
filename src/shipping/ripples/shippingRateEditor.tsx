import { type Ripple } from "@dashboard/ripples/types";

export const rippleShippingRateEditor: Ripple = {
  type: "improvement",
  ID: "shipping-rate-editor-refresh",
  TTL_seconds: 60 * 60 * 24 * 7,
  dateAdded: new Date(2026, 5, 24),
  content: {
    oneLiner: "Shipping rates are easier to manage",
    contextual:
      "Each method shows which channels have pricing. Open one to set per-channel prices, availability, and postal codes.",
    global:
      "The shipping rate editor now shows per-channel pricing inline, a channel availability summary in the sidebar, and clearer postal code controls. Shipping method metadata is in the header, and shipping zones on channel settings are clickable links.",
  },
};
