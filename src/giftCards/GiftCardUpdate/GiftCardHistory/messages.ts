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
    id: "FWaL+x",
    defaultMessage: "Gift card balance was reset",
    description: "gift card history message",
  },
  balanceResetWithAmount: {
    id: "YlJchr",
    defaultMessage: "Gift card balance was reset from {oldBalance} to {newBalance} by {resetBy}",
    description: "gift card history message",
  },
  balanceResetWithAmountAnonymous: {
    id: "OsHE5l",
    defaultMessage: "Gift card balance was reset from {oldBalance} to {newBalance}",
    description: "gift card history message",
  },
  balanceAdjusted: {
    id: "1O/T5n",
    defaultMessage: "Gift card balance was adjusted by {adjustedBy}",
    description: "gift card history message",
  },
  balanceAdjustedAnonymous: {
    id: "cSLXjT",
    defaultMessage: "Gift card balance was adjusted",
    description: "gift card history message",
  },
  balanceAdjustedWithAmount: {
    id: "hAyk99",
    defaultMessage:
      "Gift card balance was adjusted from {oldBalance} to {newBalance} by {adjustedBy}",
    description: "gift card history message",
  },
  balanceAdjustedWithAmountAnonymous: {
    id: "kB9lYq",
    defaultMessage: "Gift card balance was adjusted from {oldBalance} to {newBalance}",
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
  refundedInOrder: {
    id: "qOXgxv",
    defaultMessage: "Gift card was refunded in order {orderLink}",
    description: "gift card history message",
  },
  refundedInOrderNoLink: {
    id: "kkFOHD",
    defaultMessage: "Gift card was refunded in an order",
    description: "gift card history message",
  },
  usedInOrder: {
    id: "Uu2B2G",
    defaultMessage: "Gift card was used as a payment method on order {orderLink} <buyer>by</buyer>",
    description: "gift card history message",
  },
  usedInOrderAnonymous: {
    id: "408KSO",
    defaultMessage: "Gift card was used as a payment method on order {orderLink}",
    description: "gift card history message",
  },
  assignedToUser: {
    id: "GOKr7S",
    defaultMessage: "Gift card was assigned to {customer}",
    description: "gift card history message",
  },
  assignedToUserBy: {
    id: "6a+Epp",
    defaultMessage: "Gift card was assigned to {customer} by {assignedBy}",
    description: "gift card history message",
  },
  unassignedFromUser: {
    id: "AXEs7u",
    defaultMessage: "Gift card was unassigned from {customer}",
    description: "gift card history message",
  },
  unassignedFromUserBy: {
    id: "Za3SQQ",
    defaultMessage: "Gift card was unassigned from {customer} by {unassignedBy}",
    description: "gift card history message",
  },
  assignmentCustomerFallback: {
    id: "D0hIP2",
    defaultMessage: "a customer",
    description: "gift card history message fallback when customer email is unavailable",
  },
});

export { giftCardHistoryMessages, giftCardHistoryTimelineMessages };
