import { IS_CLOUD_INSTANCE } from "@dashboard/config";
import {
  getPulsePromotionLink,
  PULSE_POSTER_URL,
  PULSE_VIDEO_URL,
} from "@dashboard/home/getPulsePromotionLink";
import { PULSE_DOCS_URL } from "@dashboard/links";
import { rippleActionMessages } from "@dashboard/ripples/messages";
import { type Ripple } from "@dashboard/ripples/types";

const pulsePromotionLink = getPulsePromotionLink(IS_CLOUD_INSTANCE);

const pulsePrimaryAction =
  pulsePromotionLink.kind === "internal"
    ? {
        label: rippleActionMessages.installPulse,
        href: pulsePromotionLink.to,
      }
    : {
        label: rippleActionMessages.explorePulse,
        href: pulsePromotionLink.href,
      };

export const rippleSaleorPulse: Ripple = {
  type: "newApp",
  ID: "saleor-pulse",
  TTL_seconds: 60 * 60 * 24 * 14, // 14 days
  dateAdded: new Date(2026, 6, 31), // Jul 31, 2026
  content: {
    oneLiner: "Saleor Pulse",
    contextual: "See real-time store analytics on your homepage — revenue, orders, and operations.",
    global:
      "Saleor Pulse brings real-time analytics into the Dashboard homepage: commercial performance, operational health, and product-level context without a separate BI project.",
  },
  media: {
    kind: "video",
    src: PULSE_VIDEO_URL,
    poster: PULSE_POSTER_URL,
  },
  actions: [
    {
      label: rippleActionMessages.seeDocs,
      href: PULSE_DOCS_URL,
    },
    pulsePrimaryAction,
  ],
};
