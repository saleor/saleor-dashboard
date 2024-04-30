import { defineMessages } from "react-intl";

export const refundGridMessages = defineMessages({
  statusCell: {
    defaultMessage: "Status",
    id: "8DyXiQ",
    description: "refund datagrid status column",
  },
  amountCell: {
    defaultMessage: "Amount",
    id: "W6VS7F",
    description: "refund datagrid amount column",
  },
  reasonCell: {
    defaultMessage: "Reason",
    id: "2v3tZ2",
    description: "refund datagrid reason column",
  },
  dateCell: {
    defaultMessage: "Date",
    id: "pnPj0b",
    description: "refund datagrid date column",
  },
  accountCell: {
    defaultMessage: "Account",
    id: "JxWKvr",
    description: "refund datagrid account column",
  },
  addNewRefund: {
    defaultMessage: "Add new refund",
    id: "4XRIV5",
    description: "add new refund button",
  },
  refundSection: {
    defaultMessage: "Refunds",
    id: "w067gF",
    description: "refund section header",
  },
  noRefunds: {
    defaultMessage: "No refunds made for this order.",
    id: "ZU1Kz8",
    description: "empty state message",
  },
  notEditableSuccessfully: {
    id: "4i7ED7",
    defaultMessage: "This refund has been successfully processed and cannot be edited",
  },
  notEditablePending: {
    id: "x0n6YG",
    defaultMessage: "This refund is currently being processed and cannot be edited",
  },
  notEditableManual: {
    id: "2eHzVW",
    defaultMessage: "Manual refunds cannot be edited",
  },
  manualRefund: {
    id: "FZTrzW",
    defaultMessage: "Manual refund",
  },
  noTransactionsToRefund: {
    id: "brkxbY",
    defaultMessage: "There are no transactions to refund",
  },
  allTransactionsNonRefundable: {
    id: "OSnO9P",
    defaultMessage: "All transactions are non-refundable",
  },
});

export const refundStatuses = defineMessages({
  failure: {
    id: "DOHARW",
    defaultMessage: "Failure",
    description: "Refund status failure",
  },
  success: {
    id: "4z1O0N",
    defaultMessage: "Success",
    description: "Refund status success",
  },
  pending: {
    id: "SBlTvZ",
    defaultMessage: "Pending",
    description: "Refund status pending",
  },
  draft: {
    id: "nIuKz3",
    defaultMessage: "Draft",
    description: "Refund status none",
  },
});
