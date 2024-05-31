import { defineMessages } from "react-intl";

export const messages = defineMessages({
  title: {
    id: "IOg+Hh",
    defaultMessage: "Refund with manual amount",
  },
  refundAmount: {
    id: "Bl6896",
    defaultMessage: "Refund amount",
  },
  selectTransaction: {
    id: "JJLkzh",
    defaultMessage: "Select transaction to refund",
  },
  sidebardDescription: {
    id: "Ql7OM1",
    defaultMessage:
      "Performing a manual refund will immediately trigger a refund request and decrease the transaction’s charged amount, impacting the order balance.",
  },
  seeDocs: {
    id: "e0lt+l",
    defaultMessage: "See documentation",
  },
  notRefundable: {
    id: "HW6Vef",
    defaultMessage: "This transaction is non-refundable",
  },
  defaultTransactionName: {
    id: "p9bXAy",
    defaultMessage: "Transaction",
    description: "default transaction name",
  },
});

export const validationMessages = defineMessages({
  amountRequired: {
    id: "z3w/oL",
    defaultMessage: "You must provide amount value",
  },
  transactionIdRequired: {
    id: "F2kF9e",
    defaultMessage: "You must select transaction that you want to refund",
  },
  amountExceedsChargedAmount: {
    id: "kfvvnM",
    defaultMessage: "Provided amount cannot exceed charged amount for the selected transaction",
  },
});
