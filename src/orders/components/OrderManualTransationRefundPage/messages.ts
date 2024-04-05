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
  selectTransation: {
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
    id: "o/C2sb",
    defaultMessage: "This transaction is not-refundable",
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
});
