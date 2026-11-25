import { IS_CLOUD_INSTANCE } from "@dashboard/config";
import {
  getPulsePromotionLink,
  PULSE_POSTER_URL,
  PULSE_VIDEO_URL,
} from "@dashboard/home/getPulsePromotionLink";
import { PULSE_DOCS_URL } from "@dashboard/links";
import { rippleActionMessages } from "@dashboard/ripples/messages";
import { type Ripple } from "@dashboard/ripples/types";
import { defineMessages } from "react-intl";

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

const contentMessages = defineMessages({
  oneLiner: {
    id: "0Lloq1",
    defaultMessage: "Saleor Pulse",
    description: "ripple title",
  },
  contextual: {
    id: "gVSpJv",
    defaultMessage:
      "See real-time store analytics on your homepage — revenue, orders, and operations.",
    description: "ripple contextual hint",
  },
  global: {
    id: "eODrpH",
    defaultMessage:
      "Saleor Pulse brings real-time analytics into the Dashboard homepage: commercial performance, operational health, and product-level context without a separate BI project.",
    description: "ripple description in What's New",
  },
});

export const rippleSaleorPulse: Ripple = {
  type: "newApp",
  ID: "saleor-pulse",
  TTL_seconds: 60 * 60 * 24 * 14, // 14 days
  dateAdded: new Date(2026, 6, 31), // Jul 31, 2026
  content: {
    oneLiner: contentMessages.oneLiner,
    contextual: contentMessages.contextual,
    global: contentMessages.global,
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
