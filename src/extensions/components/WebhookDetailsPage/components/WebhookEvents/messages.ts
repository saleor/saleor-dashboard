import { defineMessages } from "react-intl";

export const messages = defineMessages({
  events: {
    id: "cZN5Jd",
    defaultMessage: "Events",
    description: "Webhook details events",
  },
  synchronous: {
    id: "yAFaVK",
    defaultMessage: "Synchronous",
    description: "Webhook details synchronous events",
  },
  asynchronous: {
    id: "mSCZd4",
    defaultMessage: "Asynchronous",
    description: "Webhook details asynchronous events",
  },
  synchronousDescription: {
    id: "16Dpgb",
    defaultMessage:
      "Synchronous webhook sends payload and waits for a response from the target URL to continue processing.",
    description: "Synchronous events description",
  },
  asynchronousDescription: {
    id: "yJqbYv",
    defaultMessage: "Asynchronous webhook sends payload and continues processing.",
    description: "Asynchronous events description",
  },
  objects: {
    defaultMessage: "Objects",
    id: "F6LHyk",
    description: "Webhook details objects",
  },
  webhookEvents: {
    id: "QAisk4",
    defaultMessage: "Webhook events",
    description: "Webhook events header",
  },
  directStockModeBadge: {
    id: "BSGid2",
    defaultMessage: "Direct stock mode only",
    description:
      "Advisory badge shown next to a webhook event in the picker when the event only fires while the shop has the direct (non-legacy) warehouse-channel stock-availability mode enabled.",
  },
  directStockModeTooltipBody: {
    id: "BrRGIJ",
    defaultMessage:
      'Fires only while "Use legacy shipping zone stock availability" is disabled in site settings. Otherwise the subscription produces no deliveries.',
    description:
      "Tooltip body for the direct-stock-mode-only badge in the webhook event picker. Quotes the exact label of the toggle on the site-settings page so the admin recognizes it when they click through.",
  },
  directStockModeTooltipLink: {
    id: "vh9a5S",
    defaultMessage: "Open shop settings",
    description:
      "Tooltip CTA on the direct-stock-mode-only badge in the webhook event picker. Links to the page where the legacy stock-availability flag can be toggled.",
  },
});
