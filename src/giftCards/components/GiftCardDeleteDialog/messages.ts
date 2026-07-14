import { defineMessages } from "react-intl";

export const giftCardDeleteDialogMessages = defineMessages({
  title: {
    id: "a+iRI1",
    defaultMessage: "{selectedItemsCount,plural,one{Delete Gift Card} other{Delete Gift Cards}}",
    description: "single gift card title",
  },
  defaultDescription: {
    id: "Kv58Rx",
    defaultMessage:
      "{selectedItemsCount,plural,one{Are you sure you want to delete this gift card?} other{Are you sure you want to delete {selectedItemsCount} gift cards?}}",
    description: "default gift card delete description",
  },
  withBalanceSubtitle: {
    id: "zCjsF7",
    defaultMessage:
      "{selectedItemsCount,plural,one{This gift card has available balance. Deleting it will remove funds the customer can still redeem.} other{These gift cards have available balance. Deleting them will remove funds customers can still redeem.}}",
    description: "delete gift cards with balance subtitle",
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
