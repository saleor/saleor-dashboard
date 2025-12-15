import { defineMessages } from "react-intl";

export const messages = defineMessages({
  channelName: {
    id: "UymotP",
    defaultMessage: "Channel name",
    description: "channel name",
  },
  channelSlug: {
    id: "74Zo/H",
    defaultMessage: "Slug",
    description: "channel slug",
  },
  channelSettings: {
    id: "3y4r+z",
    defaultMessage: "Channel Settings",
    description: "channel settings",
  },
  channelCurrency: {
    id: "9Sz0By",
    defaultMessage: "Currency",
    description: "channel currency",
  },
  selectedCurrency: {
    id: "39yi8w",
    defaultMessage: "Selected currency",
    description: "selected currency",
  },
  defaultCountry: {
    id: "tV+Dcm",
    defaultMessage: "Default country",
  },
  orderExpiration: {
    id: "kVKTwC",
    defaultMessage: "Order expiration",
    description: "order expiration card title",
  },
  orderExpirationDescription: {
    id: "U+79k0",
    defaultMessage:
      "The time in days after expired orders will be deleted. Allowed range between 1 and 120.",
    description: "order expiration card description",
  },
  markAsPaid: {
    id: "L2tvTm",
    defaultMessage: "Use Transaction flow when marking order as paid",
    description: "mark as paid strategy checkbox label",
  },
  allowUnpaidOrdersLabel: {
    id: "fuFCpI",
    defaultMessage: "Allow unpaid orders",
    description: "allow unpaid orders checkbox label",
  },
  allowUnpaidOrdersDescription: {
    id: "8iUzOU",
    defaultMessage: "Enables completing checkout with order before a successful payment.",
    description: "allow unpaid orders checbkox description",
  },
  defaultTransactionFlowStrategyLabel: {
    id: "5O8EIz",
    defaultMessage: "Authorize transactions instead of charging",
    description: "Authorize transactions instead of charging",
  },
  defaultTransactionFlowStrategyDescription: {
    id: "nwcJVT",
    defaultMessage:
      "When enabled, all transactions would require an additional step to be charged. ({link})",
    description: "When enabled, all transactions would require an additional step to be charged.",
  },
  automaticallyCompleteCheckoutsLabel: {
    id: "GFkb2t",
    defaultMessage: "Automatically complete checkouts when fully paid",
    description: "automatically complete checkouts checkbox label",
  },
  automaticallyCompleteCheckoutsDescription: {
    id: "ZZb4E+",
    defaultMessage:
      "When enabled, checkouts detected as fully paid will be completed automatically, without checkoutComplete mutation. {link}",
    description: "automatically complete checkouts checkbox description",
  },

  allowLegacyGiftCardUseLabel: {
    id: "sE7fI/",
    defaultMessage: "Allow legacy gift card use",
    description: "allow legacy gift card use label",
  },
  allowLegacyGiftCardUseDescription: {
    id: "OqYCQ4",
    defaultMessage:
      "When enabled, gift card can be applied to a checkout using addPromoCode mutation.",
    description: "allow legacy gift card use description",
  },
  automaticCompletionDelayLabel: {
    id: "YL8K/3",
    defaultMessage: "Delay before completion (minutes). Default is 30.",
    description: "automatic completion delay input label",
  },
  automaticCompletionDelayDescription: {
    id: "FjywW1",
    defaultMessage:
      "Time in minutes to wait after checkout is fully paid before automatically completing it. Set to 0 for immediate completion. Default is 30 minutes.",
    description: "automatic completion delay input description",
  },
  automaticCompletionCutOffDateLabel: {
    id: "C4zBRT",
    defaultMessage: "Cut-off date",
    description: "automatic completion cut-off date label",
  },
  automaticCompletionCutOffDateDescription: {
    id: "jp2Jjs",
    defaultMessage:
      "Only checkouts created on or after this date will be automatically completed. If not set, current time will be used. {link}",
    description: "automatic completion cut-off date description",
  },
  automaticCompletionCutOffDateCheckboxLabel: {
    id: "wo7tA9",
    defaultMessage: "Custom cut-off date",
    description: "automatic completion cut-off date checkbox label",
  },
  automaticCompletionCutOffDateWarning: {
    id: "Gt5T8I",
    defaultMessage:
      "If cut-off date is not set, system will automatically use current date & time. If you want to customize this behavior, you can provide custom time (past or the future)",
    description: "automatic completion cut-off date warning",
  },
  automaticCompletionCutOffDateInfo: {
    id: "v9D1pm",
    defaultMessage:
      "Setting a cut-off date will not stop checkouts that are already in the process of being completed.",
    description: "automatic completion cut-off date info message",
  },
  automaticCompletionSetCurrentDateTime: {
    id: "XtULua",
    defaultMessage: "Set to current date and time",
    description: "button to set cut-off date to current date and time",
  },
  automaticCompletionDisabledInfo: {
    id: "8jgfPX",
    defaultMessage:
      "Disabling automatic completion will not stop checkouts that are already scheduled for completion.",
    description: "automatic completion disabled info message",
  },
  automaticCompletionZeroDelayWarning: {
    id: "YTvn5m",
    defaultMessage:
      "Setting delay to 0 will complete checkouts immediately after payment. This may break your storefront if it expects the Checkout object to remain available. ({link})",
    description: "automatic completion zero delay warning message",
  },
  automaticCompletionCutOffDateEarlierWarning: {
    id: "LJqVaO",
    defaultMessage:
      "Setting cut-off date {timeDifference} earlier (from {previousDate} to {newDate}) will cause checkouts created between these dates to be automatically completed.",
    description: "automatic completion cut-off date earlier warning message",
  },
  automaticCompletionCutOffDateLaterInfo: {
    id: "SPGU7Z",
    defaultMessage:
      "Setting cut-off date {timeDifference} later (from {previousDate} to {newDate}) will not stop checkouts that are already scheduled for completion.",
    description: "automatic completion cut-off date later info message",
  },
  automaticCompletionResetToSaved: {
    id: "3Gkj+d",
    defaultMessage: "Reset to saved value",
    description: "button to reset cut-off date to saved value",
  },
  automaticCompletionCutOffDateDisabledTooltip: {
    id: "aWJPo+",
    defaultMessage:
      "Cut-off date cannot be disabled once automatic completion is enabled. You can change the date to a different value.",
    description: "tooltip explaining why cut-off date checkbox is disabled",
  },
  automaticCompletionCutOffDateTooOldError: {
    id: "j+lQWT",
    defaultMessage: "Cut-off date cannot be more than 30 days in the past",
    description: "error message when cut-off date is older than 30 days",
  },
});
