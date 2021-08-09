import { defineMessages } from "react-intl";

export const giftCardDeleteDialogMessages = defineMessages({
  title: {
    defaultMessage:
      "{counter,plural,one{Delete Gift Card} other{Delete Gift Cards}}",
    description: "GiftCardDeleteDialog single title"
  },
  defaultDescription: {
    defaultMessage:
      "{counter,plural,one{Are you sure you want to delete this gift card?} other{Are you sure you want to delete {selectedQuantity} giftCards?}}",
    description: "GiftCardDeleteDialog default description"
  },
  withBalanceDescription: {
    defaultMessage:
      "{counter,plural,one{The gift card you are about to delete has available balance. By deleting this card you may remove balance available to your customer.} other{You are about to delete gift cards with available balance. Are you sure you want to do that?}}",
    description: "GiftCardDeleteDialog with balance description"
  },
  consentLabel: {
    defaultMessage:
      "{counter,plural,one{I am aware that I am removing a gift card with balance} other{I am aware that I am removing gift cards with balance}}",
    description: "GiftCardDeleteDialog consent label"
  },
  deleteSuccessAlertText: {
    defaultMessage:
      "{counter,plural,one{Successfully deleted gift card} other{Successfully deleted gift cards}}",
    description: "GiftCardDeleteDialog success alert text"
  }
});
