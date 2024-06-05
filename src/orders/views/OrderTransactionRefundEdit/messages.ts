import { defineMessages } from "react-intl";

export const transactionRefundEditMessages = defineMessages({
  noAmountError: {
    defaultMessage: "Amount should be greater than 0",
    id: "FX7ts2",
    description: "error message",
  },
  savedDraft: {
    defaultMessage: "Saved draft",
    id: "vqu+23",
    description: "success notifier message",
  },
  amountExceedsChargedAmount: {
    defaultMessage: "Provided amount cannot exceed charged amount for the selected transaction",
    id: "vpTyL1",
    description: "error message",
  },
});
