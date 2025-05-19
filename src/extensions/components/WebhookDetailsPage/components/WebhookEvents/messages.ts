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
});
