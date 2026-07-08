import { defineMessages } from "react-intl";

export const stockExceededDialogMessages = defineMessages({
  title: {
    defaultMessage: "Not enough stock",
    id: "qZHHed",
    description: "stock exceeded dialog title",
  },
  infoLabel: {
    defaultMessage:
      "{count, plural, one {# item exceeds available stock.} other {# items exceed available stock.}} Go back to adjust quantities, or fulfill anyway to oversell.",
    id: "0I+Z8l",
    description: "stock exceeded dialog description",
  },
  goBackButton: {
    defaultMessage: "Go back",
    id: "bavdMA",
    description: "stock exceeded dialog go back button",
  },
  fulfillButton: {
    defaultMessage: "Fulfill anyway",
    id: "VSj89H",
    description: "fulfill button label",
  },
  productLabel: {
    defaultMessage: "Product",
    id: "74Cxe8",
    description: "table header product label",
  },
  toFulfillLabel: {
    defaultMessage: "To fulfill",
    id: "xB7Jge",
    description: "table header quantity to fulfill label",
  },
  availableStockLabel: {
    defaultMessage: "Available",
    id: "JMBsrr",
    description: "table header available stock label",
  },
  shortLabel: {
    defaultMessage: "Short",
    id: "7F+Lpf",
    description: "table header stock shortfall label",
  },
});
