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
    id: "byCwum",
    defaultMessage: "Timeline",
    description: "gift card detail page, activity timeline section title",
  },
});
const giftCardHistoryTimelineMessages = defineMessages({
  activatedAnonymous: {
    id: "pCy5EP",
    defaultMessage: "Gift card was activated",
    description: "gift card history message",
  },
  balanceResetAnonymous: {
    id: "FWaL+x",
    defaultMessage: "Gift card balance was reset",
    description: "gift card history message",
  },
  balanceResetWithAmountAnonymous: {
    id: "OsHE5l",
    defaultMessage: "Gift card balance was reset from {oldBalance} to {newBalance}",
    description: "gift card history message",
  },
  balanceAdjustedAnonymous: {
    id: "cSLXjT",
    defaultMessage: "Gift card balance was adjusted",
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
  deactivatedAnonymous: {
    id: "NvwS/N",
    defaultMessage: "Gift card was deactivated",
    description: "gift card history message",
  },
  expiryDateUpdateAnonymous: {
    id: "fLhj3a",
    defaultMessage: "Gift card expiry date was updated",
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
  usedInOrderAnonymous: {
    id: "408KSO",
    defaultMessage: "Gift card was used as a payment method on order {orderLink}",
    description: "gift card history message",
  },
  usedInOrderNoLink: {
    id: "CI5owv",
    defaultMessage: "Gift card was used as a payment method on an order",
    description: "gift card history message when order link is unavailable",
  },
  assignedToUser: {
    id: "GOKr7S",
    defaultMessage: "Gift card was assigned to {customer}",
    description: "gift card history message",
  },
  unassignedFromUser: {
    id: "AXEs7u",
    defaultMessage: "Gift card was unassigned from {customer}",
    description: "gift card history message",
  },
  assignmentCustomerFallback: {
    id: "D0hIP2",
    defaultMessage: "a customer",
    description: "gift card history message fallback when customer email is unavailable",
  },
});

export { giftCardHistoryMessages, giftCardHistoryTimelineMessages };
