import { defineMessages } from "react-intl";

const messages = defineMessages({
  confirmBtn: {
    id: "QZVD+5",
    defaultMessage: "Unassign and save",
    description: "button, unassign attribute from object",
  },
  content: {
    id: "XwrKOi",
    defaultMessage:
      "{counter,plural,one{Are you sure you want to unassign this attribute from {itemTypeName}?} other{Are you sure you want to unassign {attributeQuantity} attributes from {itemTypeName}?}}",
    description: "unassign multiple attributes from item",
  },
});

export default messages;
