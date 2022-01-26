import { defineMessages } from "react-intl";

const giftCardHistoryMessages = defineMessages({
  noteAddedSuccessfully: {
    defaultMessage: "Note was added sucessfully",
    description: "notifier message"
  },
  noteAddError: {
    defaultMessage: "There was an error adding a note",
    description: "notifier message"
  },
  historyHeaderTitle: {
    defaultMessage: "Gift Card Timeline",
    description: "section header title"
  }
});

const giftCardHistoryTimelineMessages = defineMessages({
  giftCardActivated: {
    defaultMessage: "Gift card was activated by {activatedBy}",
    description: "gift card history message"
  },
  giftCardBalanceReset: {
    defaultMessage: "Gift card balance was reset by {resetBy}",
    description: "gift card history message"
  },
  giftCardBought: {
    defaultMessage: "Gift card was bought in order {orderNumber}",
    description: "gift card history message"
  },
  giftCardDeactivated: {
    defaultMessage: "Gift card was deactivated by {deactivatedBy}",
    description: "gift card history message"
  },
  giftCardExpiryDateUpdate: {
    defaultMessage: "Gift card expiry date was updated by {expiryUpdatedBy}",
    description: "gift card history message"
  },
  giftCardIssued: {
    defaultMessage: "Gift card was issued by {issuedBy}",
    description: "dsc"
  },
  giftCardResent: {
    defaultMessage: "Gift card was resent",
    description: "gift card history message"
  },
  giftCardSentToCustomer: {
    defaultMessage: "Gift card was sent to customer",
    description: "gift card history message"
  },
  giftCardTagsUpdated: {
    defaultMessage: "Gift card tags were updated",
    description: "gift card history message"
  },
  giftCardUsedInOrder: {
    defaultMessage:
      "Gift card was used as a payment method on order {orderLink} <buyer>by</buyer>",
    description: "gift card history message"
  }
});

export { giftCardHistoryMessages, giftCardHistoryTimelineMessages };
