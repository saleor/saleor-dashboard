import { defineMessages } from "react-intl";

export const giftCardSendToCustomerMessages = defineMessages({
  sendToCustomerSelectedLabel: {
    id: "Um3g00",
    defaultMessage: "Send gift card to customer",
    description: "send to customer selected label",
  },
  customerSubtitle: {
    id: "FRJRmi",
    defaultMessage:
      "Selected customer will be sent the generated gift card code. Someone else can redeem the gift card code. Gift card will be assigned to account which redeemed the code.",
    description: "selected customer gift card is sent to subtitle",
  },
  customerChannelSubtitle: {
    id: "0sd4ez",
    defaultMessage: "Customer will be sent the gift card code via this channels email address",
    description: "selected customer channel subtitle",
  },
  channelSelectLabel: {
    id: "LA13a5",
    defaultMessage: "Channel",
    description: "channel select label",
  },
  currencyRedemptionInfo: {
    id: "pY/9R2",
    defaultMessage:
      "This {currency} gift card can only be redeemed in channels that use {currency}. The delivery channel above only controls which email notification is sent.",
    description: "gift card currency redemption info callout",
  },
  currencyMismatchWarning: {
    id: "srtbbS",
    defaultMessage:
      "The selected channel uses {channelCurrency}, but this gift card is in {giftCardCurrency}. The customer can still receive the code by email, but they will only be able to redeem it in {giftCardCurrency} channels at checkout.",
    description: "gift card currency mismatch with delivery channel callout",
  },
});
