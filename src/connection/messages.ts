import { defineMessages } from "react-intl";

export const connectionMessages = defineMessages({
  offlineTitle: {
    id: "R5JuCC",
    defaultMessage: "You're offline.",
    description: "connection banner heading when the browser has no network connection",
  },
  offlineDescription: {
    id: "ypc1po",
    defaultMessage:
      "You're still signed in, and unsaved changes stay on this page. We'll reconnect when you're back online.",
    description: "connection banner text when the browser has no network connection",
  },
  unreachableTitle: {
    id: "igPcAg",
    defaultMessage: "Can't reach Saleor.",
    description: "connection banner heading when requests to the Saleor API get no answer",
  },
  unreachableDescription: {
    id: "IPcSvX",
    defaultMessage:
      "You're still signed in, and unsaved changes stay on this page. Trying to reconnect…",
    description: "connection banner text when requests to the Saleor API get no answer",
  },
  tryNow: {
    id: "ckIcOY",
    defaultMessage: "Try now",
    description: "connection banner button that checks the connection to Saleor right away",
  },
  restored: {
    id: "96Dqyf",
    defaultMessage: "Connected again.",
    description: "connection banner text shown briefly once Saleor answers again",
  },
  loadFailedTitle: {
    id: "Y5oSsQ",
    defaultMessage: "Couldn't load some data",
    description:
      "toast heading when data on the page couldn't be loaded because Saleor gave no answer",
  },
  loadFailedDescription: {
    id: "OLE34z",
    defaultMessage: "Reload the page to try again.",
    description:
      "toast text when data on the page couldn't be loaded because Saleor gave no answer",
  },
});
