import { defineMessages } from "react-intl";

export const messages = defineMessages({
  title: {
    id: "v41uKG",
    defaultMessage: "Create channel",
    description: "create channel dialog title",
  },
  description: {
    id: "zkfMxY",
    defaultMessage:
      "A channel is a market: one currency and default country for prices, tax, and checkout.",
    description: "create channel dialog description",
  },
  duplicateTitle: {
    id: "5dQWTz",
    defaultMessage: "Duplicate channel",
    description: "create channel dialog title when cloning settings from another channel",
  },
  duplicateDescription: {
    id: "rGANbD",
    defaultMessage:
      "Copies settings, warehouses, and shipping zones. Product listings and tax configuration are not copied — review currency and country before creating.",
    description: "create channel dialog description when duplicating",
  },
  duplicateName: {
    id: "Gk5o6q",
    defaultMessage: "Copy of {name}",
    description: "prefilled name when duplicating a channel",
  },
  submit: {
    id: "FwUe5N",
    defaultMessage: "Create",
    description: "create channel dialog submit",
  },
});
