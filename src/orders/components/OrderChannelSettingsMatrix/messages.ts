import { defineMessages } from "react-intl";

/**
 * Short matrix tooltips — one idea each, grounded in OrderSettings schema /
 * delete_expired_orders_task. Keep under ~120 chars so they wrap in a narrow tip.
 */
export const orderChannelSettingsMatrixMessages = defineMessages({
  autoConfirmTooltipIntro: {
    id: "KS1nhQ",
    defaultMessage: "Status of new storefront orders:",
    description: "Intro line for auto-confirm matrix tooltip",
  },
  autoConfirmOnLabel: {
    id: "yPMIz3",
    defaultMessage: "On",
    description: "Label for enabled auto-confirm row in tooltip",
  },
  autoConfirmOffLabel: {
    id: "87rPKi",
    defaultMessage: "Off",
    description: "Label for disabled auto-confirm row in tooltip",
  },
  autoFulfillGiftCardsTooltip: {
    id: "TTbx89",
    defaultMessage: "Auto-fulfills non-shippable gift card lines when the order is created.",
    description: "Short tooltip for OrderSettings.automaticallyFulfillNonShippableGiftCard",
  },
  allowUnpaidTooltip: {
    id: "Av27o5",
    defaultMessage:
      "Lets checkout finish and create an order before payment fully covers the total.",
    description:
      "Short merchant-facing tooltip for OrderSettings.allowUnpaidOrders (avoid GraphQL mutation names)",
  },
  deleteExpiredTooltip: {
    id: "KkQkcu",
    defaultMessage:
      "Days after an order expires before it is permanently deleted. Allowed range: 1–120.",
    description:
      "Short tooltip for OrderSettings.deleteExpiredOrdersAfter (docs: order expiration)",
  },
  columnHelpAriaLabel: {
    id: "GkJBnh",
    defaultMessage: "More information about {column}",
    description: "Accessible label for matrix column help icon",
  },
  hideInactiveChannels: {
    id: "2biVb2",
    defaultMessage: "Hide inactive channels",
    description: "Toggle to filter inactive channels out of the order settings matrix",
  },
  matrixDescription: {
    id: "tcOGcd",
    defaultMessage:
      "Edit per-channel values here or open a channel for checkout, payment, and other channel settings.",
    description: "matrix section description on editable orders hub",
  },
});
