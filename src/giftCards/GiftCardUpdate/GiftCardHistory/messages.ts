import { defineMessages } from "react-intl";

const giftCardHistoryMessages = defineMessages({
  noteAddedSuccessfully: {
    id: "WS4ov0",
    defaultMessage: "Note was added sucessfully",
    description: "notifier message",
  },
  noteAddError: {
    id: "JgNb8X",
    defaultMessage: "There was an error adding a note",
    description: "notifier message",
  },
  historyHeaderTitle: {
    id: "4Z0O2B",
    defaultMessage: "Gift Card Timeline",
    description: "section header title",
  },
});

const giftCardHistoryTimelineMessages = defineMessages({
  activated: {
    id: "fExm0/",
    defaultMessage: "Gift card was activated by {activatedBy}",
    description: "gift card history message",
  },
  activatedAnonymous: {
    id: "pCy5EP",
    defaultMessage: "Gift card was activated",
    description: "gift card history message",
  },
  balanceReset: {
    id: "aEc9Ar",
    defaultMessage: "Gift card balance was reset by {resetBy}",
    description: "gift card history message",
  },
  balanceResetAnonymous: {
    id: "aEc9Ar",
    defaultMessage: "Gift card balance was reset by {resetBy}",
    description: "gift card history message",
  },
  bought: {
    id: "PcQRxi",
    defaultMessage: "Gift card was bought in order {orderNumber}",
    description: "gift card history message",
  },
  deactivated: {
    id: "gAqkrG",
    defaultMessage: "Gift card was deactivated by {deactivatedBy}",
    description: "gift card history message",
  },
  deactivatedAnonymous: {
    id: "NvwS/N",
    defaultMessage: "Gift card was deactivated",
    description: "gift card history message",
  },
  expiryDateUpdate: {
    id: "vQunFc",
    defaultMessage: "Gift card expiry date was updated by {expiryUpdatedBy}",
    description: "gift card history message",
  },
  expiryDateUpdateAnonymous: {
    id: "fLhj3a",
    defaultMessage: "Gift card expiry date was updated",
    description: "gift card history message",
  },
  issued: {
    id: "30X9S8",
    defaultMessage: "Gift card was issued by {issuedBy}",
    description: "gift card history message",
  },
  issuedAnonymous: {
    id: "jDovoJ",
    defaultMessage: "Gift card was issued",
    description: "gift card history message",
  },
  resent: {
    id: "gj3MUg",
    defaultMessage: "Gift card was resent",
    description: "gift card history message",
  },
  sentToCustomer: {
    id: "tsL3IW",
    defaultMessage: "Gift card was sent to customer",
    description: "gift card history message",
  },
  tagsUpdated: {
    id: "vkAWwY",
    defaultMessage: "Gift card tags were updated",
    description: "gift card history message",
  },
  usedInOrder: {
    id: "Uu2B2G",
    defaultMessage:
      "Gift card was used as a payment method on order {orderLink} <buyer>by</buyer>",
    description: "gift card history message",
  },
  usedInOrderAnonymous: {
    id: "408KSO",
    defaultMessage:
      "Gift card was used as a payment method on order {orderLink}",
    description: "gift card history message",
  },
});

export { giftCardHistoryMessages, giftCardHistoryTimelineMessages };
