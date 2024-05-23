import { defineMessages } from "react-intl";

export const messages = defineMessages({
  transactions: {
    id: "/jJLYy",
    defaultMessage: "Transactions",
  },
  amount: {
    id: "Bl6896",
    defaultMessage: "Refund amount",
  },
  selectTransaction: {
    id: "dO05fh",
    defaultMessage: "Select a refund you want to fullfill",
  },
  sidebarTitle: {
    id: "CNblvR",
    defaultMessage: "Refund fullfilling",
  },
  sidebardDescription: {
    id: "SuqHws",
    defaultMessage:
      " You are now selecting which granted refund you want to fullfill and send to a customer.",
  },
  notRefundable: {
    id: "HW6Vef",
    defaultMessage: "This transaction is non-refundable",
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
