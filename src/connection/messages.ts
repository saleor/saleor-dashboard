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
  actionFailedTitle: {
    id: "Cz5tnE",
    defaultMessage: "No answer from Saleor",
    description: "toast heading when an action got no answer because Saleor could not be reached",
  },
  actionFailedDescription: {
    id: "1ncnQ9",
    defaultMessage: "Check whether the change went through before trying again.",
    description:
      "toast text when an action got no answer from Saleor, so it may or may not have been applied",
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
  sectionLoadFailedTitle: {
    id: "v15oA0",
    defaultMessage: "Couldn't open this page",
    description: "heading shown in place of a page whose code could not be downloaded",
  },
  sectionLoadWaiting: {
    id: "7fDyD7",
    defaultMessage: "It will open once the connection is back.",
    description:
      "text under the heading when a page could not be downloaded because the connection is lost",
  },
  reloadPage: {
    id: "TwDaYs",
    defaultMessage: "Reload page",
    description:
      "button that reloads the dashboard to open a page whose code could not be downloaded",
  },
});
