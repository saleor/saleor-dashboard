import { defineMessages } from "react-intl";

export const messages = defineMessages({
  modalTitle: {
    id: "7QbJek",
    defaultMessage: "Price breakdown",
    description: "title of the line price waterfall modal",
  },
  startLabel: {
    id: "ObDPaz",
    defaultMessage: "Original price ({quantity, plural, one {# unit} other {# units}})",
    description: "starting row of the price waterfall",
  },
  endLabel: {
    id: "Cm56Lp",
    defaultMessage: "Final line total",
    description: "ending row of the price waterfall",
  },
  factorCataloguePromotion: {
    id: "mrPzXs",
    defaultMessage: "Catalogue promotion",
    description: "factor label for catalogue promotion / sale",
  },
  factorVoucherLine: {
    id: "PhXtJy",
    defaultMessage: "Voucher (line)",
    description: "factor label for line-level voucher discount",
  },
  factorVoucherOrderShare: {
    id: "y+718D",
    defaultMessage: "Voucher (order, line share)",
    description: "factor label for whole-order voucher propagated to a line",
  },
  factorOrderPromotionShare: {
    id: "drEC/t",
    defaultMessage: "Order promotion (line share)",
    description: "factor label for order promotion propagated to a line",
  },
  factorManualLine: {
    id: "hqSdxB",
    defaultMessage: "Manual line discount",
    description: "factor label for manual line discount",
  },
  factorManualOrderShare: {
    id: "qBTz2h",
    defaultMessage: "Manual order discount (line share)",
    description: "factor label for manual order discount propagated to a line",
  },
  factorOtherAdjustment: {
    id: "lff45n",
    defaultMessage: "Other adjustment",
    description:
      "factor label for an unattributed line-level adjustment that the dashboard could not match to any specific discount record",
  },
  warningManualOverridesAutomatic: {
    id: "RKd8NI",
    defaultMessage:
      "A manual line discount coexists with an automatic one. Manual takes precedence.",
    description: "warning shown on a line waterfall",
  },
  warningOrderDiscountPropagated: {
    id: "4gV+ny",
    defaultMessage:
      "Multiple order-level discounts are spread across the lines. The split between records is approximate; the line total reconciles exactly.",
    description:
      "warning shown on a line waterfall when more than one order-level discount applies",
  },
  voucherCodeLabel: {
    id: "NLnLoj",
    defaultMessage: "Code: {code}",
    description: "voucher code label appended to a voucher factor",
  },
  linkVoucherTitle: {
    id: "D1rO7x",
    defaultMessage: "Open voucher",
    description:
      "tooltip for a clickable voucher name in the line price breakdown that opens the voucher detail page",
  },
});
