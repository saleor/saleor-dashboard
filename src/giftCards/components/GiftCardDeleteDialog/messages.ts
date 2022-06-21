import { defineMessages } from "react-intl";

export const giftCardDeleteDialogMessages = defineMessages({
  title: {
    id: "a+iRI1",
    defaultMessage:
      "{selectedItemsCount,plural,one{Delete Gift Card} other{Delete Gift Cards}}",
    description: "single gift card title",
  },
  defaultDescription: {
    id: "S52JMl",
    defaultMessage:
      "{selectedItemsCount,plural,one{Are you sure you want to delete this gift card?} other{Are you sure you want to delete {selectedItemsCount} giftCards?}}",
    description: "default gift card delete description",
  },
  withBalanceDescription: {
    id: "RLZ1jd",
    defaultMessage:
      "{selectedItemsCount,plural,one{The gift card you are about to delete has available balance. By deleting this card you may remove balance available to your customer.} other{You are about to delete gift cards with available balance. Are you sure you want to do that?}}",
    description: "delete gift cards with balance description",
  },
  consentLabel: {
    id: "Yxihwg",
    defaultMessage:
      "{selectedItemsCount,plural,one{I am aware that I am removing a gift card with balance} other{I am aware that I am removing gift cards with balance}}",
    description: "consent removal of gift cards with balance button label",
  },
  deleteSuccessAlertText: {
    id: "zLtb4N",
    defaultMessage:
      "{selectedItemsCount,plural,one{Successfully deleted gift card} other{Successfully deleted gift cards}}",
    description: "gift card removed success alert message",
  },
});
