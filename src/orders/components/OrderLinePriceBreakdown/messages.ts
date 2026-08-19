import { defineMessages } from "react-intl";

export const messages = defineMessages({
  modalTitle: {
    id: "7QbJek",
    defaultMessage: "Price breakdown",
    description: "title of the line price waterfall modal",
  },
  skuLabel: {
    id: "iKWz5z",
    defaultMessage: "SKU",
    description: "SKU label inside the line price breakdown modal subtitle",
  },
  quantityLabel: {
    id: "DNj7OQ",
    defaultMessage: "Qty",
    description:
      "abbreviated quantity label inside the line price breakdown modal subtitle (compact context)",
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
  overriddenBadge: {
    id: "2IHDvg",
    defaultMessage: "Overridden",
    description: "badge marking that the base price was set custom (overridden)",
  },
  overriddenNoReason: {
    id: "+ZVimo",
    defaultMessage: "Custom price set for this line",
    description: "fallback detail when a price override has no reason recorded",
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
  factorGiftLine: {
    id: "u7eNv3",
    defaultMessage: "Free gift",
    description:
      "factor label for a free-gift order line granted by an ORDER_PROMOTION rule (line.isGift = true on the backend)",
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
  factorOrderLevelCombined: {
    id: "lsPIVu",
    defaultMessage: "Order-level discounts (combined)",
    description:
      "factor label when multiple order-level discounts contributed to a line; the per-record split is not stored by Saleor so we show the combined slice with the contributing records named below",
  },
  factorContributorsLabel: {
    id: "rj9PBV",
    defaultMessage: "Includes:",
    description:
      "caption introducing the list of records that contributed to a combined order-level factor",
  },
  warningManualOverridesAutomatic: {
    id: "RKd8NI",
    defaultMessage:
      "A manual line discount coexists with an automatic one. Manual takes precedence.",
    description: "warning shown on a line waterfall",
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
