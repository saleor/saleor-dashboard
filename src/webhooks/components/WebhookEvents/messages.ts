import { defineMessages } from "react-intl";

export const messages = defineMessages({
  events: {
    defaultMessage: "Events",
    description: "section header"
  },
  synchronousEvents: {
    defaultMessage: "Synchronous events",
    description: "section subheader"
  },
  asynchronousEvents: {
    defaultMessage: "Asynchronous events",
    description: "section subheader"
  },
  assignPermissionsToSynchronousEvents: {
    defaultMessage:
      "Assign permissions to register synchronous events for this webhook.",
    description: "section description"
  },
  assignPermissionsToAsynchronousEvents: {
    defaultMessage:
      "Assign permissions to register asynchronous events for this webhook.",
    description: "section description"
  },
  registeredEvents: {
    defaultMessage: "Registered events",
    description: "input label"
  }
});
