import { defineMessages } from "react-intl";

const messages = defineMessages({
  title: {
    defaultMessage: "Changed Customer",
    description: "dialog header"
  },
  description: {
    defaultMessage:
      "You have changed customer assigned to this order. What would you like to do with the shipping address?",
    description: "dialog description"
  },
  keepAddress: {
    defaultMessage: "Keep address",
    description: "option label"
  },
  changeAddress: {
    defaultMessage: "Change address",
    description: "option label"
  }
});

export default messages;
