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
  activated: {
    defaultMessage: "Gift card was activated by {activatedBy}",
    description: "gift card history message"
  },
  activatedAnonymous: {
    defaultMessage: "Gift card was activated",
    description: "gift card history message"
  },
  balanceReset: {
    defaultMessage: "Gift card balance was reset by {resetBy}",
    description: "gift card history message"
  },
  balanceResetAnonymous: {
    defaultMessage: "Gift card balance was reset by {resetBy}",
    description: "gift card history message"
  },
  bought: {
    defaultMessage: "Gift card was bought in order {orderNumber}",
    description: "gift card history message"
  },
  deactivated: {
    defaultMessage: "Gift card was deactivated by {deactivatedBy}",
    description: "gift card history message"
  },
  deactivatedAnonymous: {
    defaultMessage: "Gift card was deactivated",
    description: "gift card history message"
  },
  expiryDateUpdate: {
    defaultMessage: "Gift card expiry date was updated by {expiryUpdatedBy}",
    description: "gift card history message"
  },
  expiryDateUpdateAnonymous: {
    defaultMessage: "Gift card expiry date was updated",
    description: "gift card history message"
  },
  issued: {
    defaultMessage: "Gift card was issued by {issuedBy}",
    description: "gift card history message"
  },
  issuedAnonymous: {
    defaultMessage: "Gift card was issued",
    description: "gift card history message"
  },
  resent: {
    defaultMessage: "Gift card was resent",
    description: "gift card history message"
  },
  sentToCustomer: {
    defaultMessage: "Gift card was sent to customer",
    description: "gift card history message"
  },
  tagsUpdated: {
    defaultMessage: "Gift card tags were updated",
    description: "gift card history message"
  },
  usedInOrder: {
    defaultMessage:
      "Gift card was used as a payment method on order {orderLink} <buyer>by</buyer>",
    description: "gift card history message"
  },
  usedInOrderAnonymous: {
    defaultMessage:
      "Gift card was used as a payment method on order {orderLink}",
    description: "gift card history message"
  }
});

export { giftCardHistoryMessages, giftCardHistoryTimelineMessages };
