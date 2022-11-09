import { defineMessages } from "react-intl";

export const refundPageMessages = defineMessages({
  pageSubtitle: {
    defaultMessage: "Issue refund",
    id: "/nZy6A",
    description: "page subtitle",
  },
  refundBalance: {
    defaultMessage: "Refund balance",
    id: "2x9ZgK",
    description: "card title",
  },
  totalCaptured: {
    defaultMessage: "Total captured",
    id: "zf48rQ",
    description: "sum of captured amount of all transactions",
  },
  grantedRefund: {
    defaultMessage: "Granted refund",
    id: "1oYjZc",
    description: "sum of all granted refunds for an order",
  },
  pendingRefunds: {
    defaultMessage: "Pending refunds",
    id: "0whAeC",
    description: "sum of all pending refunds inside an order",
  },
  balanceAfterRequests: {
    defaultMessage: "Balance after requests",
    id: "Hc58JL",
    description: "card title",
  },
  refundName: {
    defaultMessage: "{transactionType} refund",
    id: "NnhrxZ",
    description: "amount of sent refund for transaction",
  },
  result: {
    defaultMessage: "Result",
    id: "bT71VU",
    description: "total of all sent refunds",
  },
  requestRefund: {
    defaultMessage: "Request refund",
    id: "fkgack",
    description: "button, sends refund for transaction",
  },
  refundAmount: {
    defaultMessage: "Refund amount",
    id: "ng0ZDW",
    description: "label, input for amount to refund in transaction",
  },
  setMax: {
    defaultMessage: "Set max",
    id: "d7dT8o",
    description: "button, sets granted refund amount in input",
  },
});

export const manualRefundMessages = defineMessages({
  refundManual: {
    defaultMessage: "Manual refund",
    id: "PLX6FH",
    description: "sum of all manual refunds for transaction",
  },
  refundManualDescription: {
    defaultMessage: "Create a manual refund for non-integrated payments",
    id: "LLrOK3",
    description: "paragraph, description in manual refund card",
  },
  refund: {
    defaultMessage: "Refund",
    id: "bfuxy3",
    description: "button, create new transaction with refund amount",
  },
});

export const dataLineMessages = defineMessages({
  settled: {
    defaultMessage: "Settled",
    id: "wJep/X",
    description: "refund amounts were settled",
  },
  unsettled: {
    defaultMessage: "Unsettled",
    id: "9pLPLn",
    description: "refund amounts were unsettled",
  },
});
