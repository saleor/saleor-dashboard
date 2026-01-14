import { defineMessages } from "react-intl";

export const messages = defineMessages({
  title: {
    id: "0f6YvV",
    defaultMessage: "Capture Payment",
    description: "dialog title",
  },
  statusFullyAuthorized: {
    id: "HwIhau",
    defaultMessage: "Fully Authorized",
    description: "status pill for fully authorized payment",
  },
  statusPartial: {
    id: "ayylzh",
    defaultMessage: "Partial Authorisation",
    description: "status pill for partial authorization",
  },
  statusNoAuthorization: {
    id: "mxGY7T",
    defaultMessage: "No Authorization",
    description: "status pill for no authorization",
  },
  statusFullyCaptured: {
    id: "L8J/jr",
    defaultMessage: "Fully Captured",
    description: "status pill when order is fully paid",
  },
  orderTotal: {
    id: "4YyeCx",
    defaultMessage: "Order total",
    description: "label for order total amount",
  },
  authorized: {
    id: "U0IK0G",
    defaultMessage: "Authorized",
    description: "label for authorized amount",
  },
  capturedSoFar: {
    id: "0YOedO",
    defaultMessage: "Captured so far",
    description: "label for already charged amount",
  },
  balanceDue: {
    id: "qlfssi",
    defaultMessage: "Balance due",
    description: "label for remaining amount customer owes",
  },
  availableToCapture: {
    id: "MhlYkx",
    defaultMessage: "Available to capture (authorized)",
    description: "label for available authorization amount",
  },
  transactionCaptured: {
    id: "R/YHMH",
    defaultMessage: "Already captured",
    description: "label for amount already captured from this transaction",
  },
  remainingBalance: {
    id: "OUMqG1",
    defaultMessage: "Remaining balance",
    description: "label for remaining balance to capture",
  },
  remainingMax: {
    id: "jhyt3I",
    defaultMessage: "Remaining max (authorized)",
    description: "label for max capturable amount when partial authorization",
  },
  selectAmount: {
    id: "XrliJg",
    defaultMessage: "Select amount to capture:",
    description: "label for amount selection",
  },
  optionOrderTotal: {
    id: "tS2K/N",
    defaultMessage: "Order total",
    description: "radio option for capturing order total",
  },
  optionOrderTotalHint: {
    id: "v8e93p",
    defaultMessage: "Matches what customer owes",
    description: "hint for order total option",
  },
  optionCustom: {
    id: "IU1lif",
    defaultMessage: "Custom amount",
    description: "radio option for custom capture amount",
  },
  customAmountMax: {
    id: "Mm/Stj",
    defaultMessage: "Max: {amount}",
    description: "hint showing maximum allowed custom amount",
  },
  captureButton: {
    id: "bRXgSC",
    defaultMessage: "Capture {amount}",
    description: "capture button with amount",
  },
  warningPartialAuthorization: {
    id: "8JEG80",
    defaultMessage:
      "The remaining authorization doesn't cover the balance. {shortfall} will need a separate payment.",
    description: "warning when authorized is less than total",
  },
  errorNoAuthorization: {
    id: "SnV3LR",
    defaultMessage:
      "No payment has been authorized for this order. The full amount of {amount} cannot be captured.",
    description: "error when no authorization exists",
  },
  outcomeMessage: {
    id: "HSYM17",
    defaultMessage: "This will result in {status} order",
    description: "outcome prediction showing resulting order status after capture",
  },
  statusFullyCapturedPill: {
    id: "G9y5Ze",
    defaultMessage: "Fully captured",
    description: "pill status for fully captured outcome",
  },
  statusPartiallyCapturedPill: {
    id: "BJRu4V",
    defaultMessage: "Partially captured",
    description: "pill status for partially captured outcome",
  },
  statusOvercapturedPill: {
    id: "u7ShY+",
    defaultMessage: "Overcaptured",
    description: "pill status for overcaptured outcome",
  },
});
