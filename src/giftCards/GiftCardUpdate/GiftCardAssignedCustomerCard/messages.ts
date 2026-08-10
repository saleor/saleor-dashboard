import { defineMessages } from "react-intl";

export const giftCardAssignedCustomerCardMessages = defineMessages({
  title: {
    id: "fLNQUG",
    defaultMessage: "Assigned customer",
    description: "gift card sidebar, assigned customer card title",
  },
  subtitleAssigned: {
    id: "6+zuTC",
    defaultMessage: "Restricted",
    description: "gift card sidebar, meta when a customer is assigned",
  },
  subtitleUnassigned: {
    id: "f0mrKL",
    defaultMessage: "Unrestricted",
    description: "gift card sidebar, meta when no customer is assigned",
  },
  intro: {
    id: "RkDcW2",
    defaultMessage:
      "By default, anyone with the code can redeem this card, including in guest checkout. Assign a customer to restrict redemption to their account.",
    description: "gift card sidebar, assigned customer intro microcopy",
  },
  introEmailOnly: {
    id: "X31kOG",
    defaultMessage:
      "Restricted to {email}. No customer account is linked — typically from guest checkout. Assign a customer to attach an account, or remove the restriction.",
    description: "gift card sidebar, intro when only assignedToEmail is set",
  },
  emptyTitle: {
    id: "+kfFIG",
    defaultMessage: "No customer assigned",
    description: "gift card sidebar, empty state title for assigned customer",
  },
  emptyDescription: {
    id: "zfaa1q",
    defaultMessage: "This card is unrestricted — anyone with the code can redeem it.",
    description: "gift card sidebar, empty state description for assigned customer",
  },
  assignButton: {
    id: "w/fKY5",
    defaultMessage: "Assign customer",
    description: "assign gift card to customer button",
  },
  changeButton: {
    id: "MLIPQX",
    defaultMessage: "Change",
    description: "change assigned gift card customer button",
  },
  unassignSuccess: {
    id: "ZD3/vJ",
    defaultMessage: "Customer unassigned",
    description: "gift card customer unassigned success message",
  },
});
