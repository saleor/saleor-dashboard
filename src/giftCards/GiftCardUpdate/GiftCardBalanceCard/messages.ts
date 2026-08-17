import { defineMessages } from "react-intl";

export const giftCardBalanceCardMessages = defineMessages({
  remainingBalanceLabel: {
    id: "yEy4EC",
    defaultMessage: "Remaining balance",
    description: "gift card instrument card, label above current balance",
  },
  setBalanceButton: {
    id: "bVjqu0",
    defaultMessage: "Set balance",
    description: "gift card instrument card, opens set-balance dialog",
  },
  spentOfInitial: {
    id: "qK4it1",
    defaultMessage: "{spent} spent of {initial} initial value",
    description: "gift card instrument card, caption under spend progress meter",
  },
  expiryUrgency: {
    id: "yPVBpm",
    defaultMessage:
      "{remaining} will be lost on {date} unless it is spent or you extend the expiration.",
    description: "gift card instrument card, warning when card has expiry and remaining balance",
  },
  showCode: {
    id: "2kMLBJ",
    defaultMessage: "Show code",
    description: "gift card instrument card, aria label to reveal full code",
  },
  hideCode: {
    id: "nir539",
    defaultMessage: "Hide code",
    description: "gift card instrument card, aria label to mask full code",
  },
  currencyHint: {
    id: "Ux9//2",
    defaultMessage: "Usable in any channel with the same currency.",
    description: "gift card instrument card, note that cards are not channel-scoped",
  },
  lastUsedOn: {
    id: "PWJpiZ",
    defaultMessage: "Last used {date}",
    description: "gift card instrument card, last redemption timestamp",
  },
  neverUsed: {
    id: "pCDEhW",
    defaultMessage: "Not used yet",
    description: "gift card instrument card, when lastUsedOn is empty",
  },
});
