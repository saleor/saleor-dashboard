import { defineMessages } from "react-intl";

export const statusMessages = defineMessages({
  pending: {
    defaultMessage: "Pending",
    id: "9Mro3c",
    description: "Transaction event status - pending",
  },
  success: {
    defaultMessage: "Success",
    id: "INKsSL",
    description: "Transaction event status - success",
  },
  failure: {
    defaultMessage: "Failure",
    id: "e4UtKH",
    description: "Transaction event status - failure",
  },
  request: {
    defaultMessage: "Requested",
    id: "++8ZWj",
    description: "Transaction event status - requested",
  },
  info: {
    defaultMessage: "Info",
    id: "if9gAZ",
    description: "Transaction event status - unknown status, info without event data",
  },
});

export const messages = defineMessages({
  noEvents: {
    defaultMessage: "This transaction doesn't have any events",
    id: "dnbJKr",
  },
});
