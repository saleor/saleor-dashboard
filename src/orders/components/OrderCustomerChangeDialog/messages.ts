import { defineMessages } from "react-intl";

const messages = defineMessages({
  title: {
    defaultMessage: "Would you like to change address?",
    description: "dialog header"
  },
  description: {
    defaultMessage:
      "A new customer has been assigned for this order, but the address remained of a previous customer.",
    description: "dialog description"
  },
  keepAddress: {
    defaultMessage: "Keep",
    description: "option label"
  },
  changeAddress: {
    defaultMessage: "Change",
    description: "option label"
  }
});

export default messages;
