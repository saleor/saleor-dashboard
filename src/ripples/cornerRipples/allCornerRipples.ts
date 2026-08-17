import { PulseVideoAnnouncement } from "@dashboard/home/components/PulseVideoAnnouncement/PulseVideoAnnouncement";
import { rippleSaleorPulse } from "@dashboard/home/ripples/saleorPulse";

import { type CornerRippleEntry } from "./selectActiveCornerRipple";

/**
 * Corner video announcements fixed to the viewport bottom-left.
 * Only one is shown at a time — see CornerRipplesHost / selectActiveCornerRipple.
 */
export const allCornerRipples: CornerRippleEntry[] = [
  {
    model: rippleSaleorPulse,
    Component: PulseVideoAnnouncement,
  },
];

if (process.env.NODE_ENV !== "production") {
  (function assertUniqueCornerRippleIds() {
    const ids = allCornerRipples.map(entry => entry.model.ID);
    const uniqueIds = new Set(ids);

    if (ids.length !== uniqueIds.size) {
      throw new Error("Duplicate ripple IDs detected in allCornerRipples");
    }
  })();
}
