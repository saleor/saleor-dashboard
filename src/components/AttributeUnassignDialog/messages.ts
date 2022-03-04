import { defineMessages } from "react-intl";

const messages = defineMessages({
  confirmBtn: {
    defaultMessage: "Unassign and save",
    description: "button, unassign attribute from object"
  },
  content: {
    defaultMessage:
      "Are you sure you want to unassign {attributeName} from {itemTypeName}?",
    description: "unassign attribute from object"
  }
});

export default messages;
