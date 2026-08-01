import { defineMessages } from "react-intl";

export const messages = defineMessages({
  generalSettings: {
    id: "zE3ga7",
    defaultMessage: "General settings",
    description: "channel form card title for name, slug, country, currency",
  },
  channelName: {
    id: "UymotP",
    defaultMessage: "Channel name",
    description: "channel name",
  },
  channelNameHint: {
    id: "z1yZ/P",
    defaultMessage: "Shown in the dashboard only. Customers never see it.",
    description: "helper under channel name",
  },
  channelSlug: {
    id: "74Zo/H",
    defaultMessage: "Slug",
    description: "channel slug",
  },
  channelSlugHint: {
    id: "JakPK4",
    defaultMessage:
      "Identifies this channel in the Storefront API. Changing it breaks existing storefront requests.",
    description: "helper under channel slug",
  },
  marketHelper: {
    id: "ooUWhl",
    defaultMessage:
      "A channel is a market: one currency and default country for prices, tax, and checkout. You can set up warehouses and shipping right after creating it.",
    description: "helper under create channel general info",
  },
  advancedSettings: {
    id: "6xx3Us",
    defaultMessage: "Advanced settings",
    description: "accordion title for optional channel order/payment settings on create",
  },
  defaultCountryHint: {
    id: "Q0SbHA",
    defaultMessage: "Fallback country for tax when checkout has no address yet.",
    description: "helper under channel default country",
  },
  channelCurrencyHintCreate: {
    id: "xzzNba",
    defaultMessage: "Prices and payments use this currency. It can’t be changed later.",
    description: "helper under currency on create",
  },
  channelCurrencyHintLocked: {
    id: "5HXDLH",
    defaultMessage: "Fixed at creation. To sell in another currency, create a second channel.",
    description: "helper under locked currency on edit",
  },
  orderAndCheckoutSettings: {
    id: "EXPRMd",
    defaultMessage: "Orders & fulfillment",
    description: "channel form card title for channel-owned order and checkout settings",
  },
  orderAndCheckoutSettingsHint: {
    id: "n2eKUn",
    defaultMessage:
      "Settings for this channel only. Compare all channels or edit shop-wide policies in {link}.",
    description: "channel form hint linking to orders and fulfillment settings hub",
  },
  automaticallyConfirmAllNewOrdersLabel: {
    id: "RLYfMF",
    defaultMessage: "Automatically confirm all orders",
    description: "checkbox label",
  },
  automaticallyConfirmAllNewOrdersDescription: {
    id: "wpAXKX",
    defaultMessage: "All orders will be automatically confirmed and all payments will be captured.",
    description: "checkbox label description",
  },
  automaticallyFulfillNonShippableGiftCardLabel: {
    id: "7UG1Lx",
    defaultMessage: "Automatically fulfill non shippable gift cards",
    description: "checkbox gift cards label",
  },
  automaticallyFulfillNonShippableGiftCardDescription: {
    id: "EewziG",
    defaultMessage:
      "When activated non-shippable gift cards will be automatically set as fulfilled and sent to customer",
    description: "checkbox gift cards label description",
  },
  channelCurrency: {
    id: "9Sz0By",
    defaultMessage: "Currency",
    description: "channel currency",
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
