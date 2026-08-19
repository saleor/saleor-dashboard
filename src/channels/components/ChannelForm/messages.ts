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
    id: "p/8wfM",
    defaultMessage:
      "Used in the dashboard. Storefronts may also show it to customers (for example in a market picker).",
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
  ordersSectionTitle: {
    id: "lm847Q",
    defaultMessage: "Orders",
    description: "channel form orders section title",
  },
  paymentsCheckoutSectionTitle: {
    id: "XiQfIl",
    defaultMessage: "Payments & checkout",
    description: "channel form payments and checkout section title",
  },
  automaticallyConfirmAllNewOrdersLabel: {
    id: "erZXUi",
    defaultMessage: "Confirm new orders automatically",
    description: "channel order setting label",
  },
  automaticallyConfirmAllNewOrdersDescription: {
    id: "ejo6Sh",
    defaultMessage:
      "On: orders from checkout arrive as {unfulfilled} and ready to pick. Off: they arrive {unconfirmed} and someone must review each one.",
    description: "channel order setting description for auto-confirm",
  },
  automaticallyFulfillNonShippableGiftCardLabel: {
    id: "pDbKtV",
    defaultMessage: "Fulfil non-shippable gift cards automatically",
    description: "channel order setting label for gift cards",
  },
  automaticallyFulfillNonShippableGiftCardDescription: {
    id: "+Vvntt",
    defaultMessage:
      "Digital gift cards are marked {fulfilled} and emailed to the customer without waiting for a warehouse step.",
    description: "channel order setting description for gift cards",
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
  expireOrdersLabel: {
    id: "gSTyF7",
    defaultMessage: "Expire abandoned {unconfirmed} orders",
    description: "channel order setting label for order expiration",
  },
  expireOrdersDescription: {
    id: "CkmWKG",
    defaultMessage: "Releases reserved stock from orders that were never confirmed.",
    description: "channel order setting description for order expiration",
  },
  expireOrdersAutoConfirmNotice: {
    id: "M8ME4X",
    defaultMessage:
      "No effect while {autoConfirm} is on — orders become {unfulfilled} straight away and never reach the {unconfirmed} state this applies to.",
    description: "shown under expire orders when auto-confirm is enabled",
  },
  expireOrdersAfterLabel: {
    id: "OufJut",
    defaultMessage: "Expire after",
    description: "label for expireOrdersAfter minutes input",
  },
  expireOrdersAfterUnit: {
    id: "Byk4pC",
    defaultMessage: "minutes",
    description: "unit after expireOrdersAfter input",
  },
  expireOrdersAfterHint: {
    id: "vxQsu2",
    defaultMessage: "Counted from when the order was placed.",
    description: "helper under expireOrdersAfter input",
  },
  deleteExpiredOrdersAfterLabel: {
    id: "ICT1Lt",
    defaultMessage: "Delete expired orders after",
    description: "label for deleteExpiredOrdersAfter days input",
  },
  deleteExpiredOrdersAfterUnit: {
    id: "SBquoC",
    defaultMessage: "days",
    description: "unit after deleteExpiredOrdersAfter input",
  },
  deleteExpiredOrdersAfterHint: {
    id: "PGpSUm",
    defaultMessage: "Permanent. Between 1 and 120 days.",
    description: "helper under deleteExpiredOrdersAfter input",
  },
  markAsPaid: {
    id: "+VC8bY",
    defaultMessage: '"Mark as paid" creates',
    description: "channel payments mark as paid title",
  },
  markAsPaidDescription: {
    id: "RMoQDQ",
    defaultMessage: "Which object is attached to the order when staff record a payment by hand.",
    description: "channel payments mark as paid description",
  },
  markAsPaidTransactionLabel: {
    id: "lkuKaM",
    defaultMessage: "A Transaction",
    description: "mark as paid transaction option label",
  },
  markAsPaidTransactionDescription: {
    id: "EyIpfs",
    defaultMessage:
      "Matches modern payment apps. Pick this unless you still run legacy payment plugins.",
    description: "mark as paid transaction option description",
  },
  markAsPaidRecommendedBadge: {
    id: "Gl0VOw",
    defaultMessage: "recommended",
    description: "parenthetical marker on recommended channel setting radio option",
  },
  markAsPaidPaymentLabel: {
    id: "oPaVXi",
    defaultMessage: "A Payment",
    description: "mark as paid payment option label",
  },
  markAsPaidPaymentDescription: {
    id: "CfuWsg",
    defaultMessage: "The older object, kept for deprecated payment plugins.",
    description: "mark as paid payment option description",
  },
  markAsPaidLegacyBadge: {
    id: "OWF2HL",
    defaultMessage: "legacy",
    description: "parenthetical marker on legacy channel setting radio option",
  },
  allowUnpaidOrdersLabel: {
    id: "v8CmW0",
    defaultMessage: "Allow unpaid orders",
    description: "channel order setting label for unpaid orders",
  },
  allowUnpaidOrdersDescription: {
    id: "TFb4/p",
    defaultMessage:
      "Lets checkout complete before payment succeeds. Usual for invoicing and wholesale; risky for card-only storefronts.",
    description: "channel order setting description for unpaid orders",
  },
  defaultTransactionFlowStrategyLabel: {
    id: "FTCq+9",
    defaultMessage: "Default transaction flow",
    description: "channel payments setting title",
  },
  defaultTransactionFlowStrategyDescription: {
    id: "/mtpmv",
    defaultMessage: "What payment apps are asked to do at checkout.",
    description: "channel payments setting description for transaction flow",
  },
  transactionFlowChargeLabel: {
    id: "6hrHWS",
    defaultMessage: "Charge immediately",
    description: "transaction flow charge option label",
  },
  transactionFlowChargeDescription: {
    id: "MAicWa",
    defaultMessage: "Funds are captured when the order is placed. One step, nothing to chase.",
    description: "transaction flow charge option description",
  },
  transactionFlowAuthorizeLabel: {
    id: "lZh3Xj",
    defaultMessage: "Authorise, capture later",
    description: "transaction flow authorize option label",
  },
  transactionFlowAuthorizeDescription: {
    id: "aBFzDG",
    defaultMessage:
      "Funds are held and must be captured manually. Use when you ship days later or adjust totals before charging.",
    description: "transaction flow authorize option description",
  },
  releaseFundsLabel: {
    id: "O4a1K+",
    defaultMessage: "Release held funds for expired checkouts",
    description: "channel payments release funds label",
  },
  releaseFundsDescription: {
    id: "T8rYzW",
    defaultMessage:
      "Voids authorisations left behind by checkouts that were never completed, so customers aren't left with a hold on their card.",
    description: "channel payments release funds description",
  },
  releaseFundsAfterLabel: {
    id: "B/iTPS",
    defaultMessage: "Release after",
    description: "label for checkoutTtlBeforeReleasingFunds hours input",
  },
  releaseFundsAfterUnit: {
    id: "qx2mD0",
    defaultMessage: "hours",
    description: "unit after checkoutTtlBeforeReleasingFunds input",
  },
  releaseFundsAfterHint: {
    id: "xPsePF",
    defaultMessage: "Counted from when the checkout expired.",
    description: "helper under checkoutTtlBeforeReleasingFunds input",
  },
  automaticallyCompleteCheckoutsLabel: {
    id: "iZHrIY",
    defaultMessage: "Turn fully paid checkouts into orders automatically",
    description: "channel payments auto-complete checkouts label",
  },
  automaticallyCompleteCheckoutsDescription: {
    id: "7Fj+JA",
    defaultMessage:
      "Your storefront no longer needs to call checkoutComplete once payment is authorised. Only applies to payments made through transactions.",
    description: "channel payments auto-complete checkouts description",
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
