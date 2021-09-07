import { defineMessages } from "react-intl";

export const giftCardSendToCustomerMessages = defineMessages({
  sendToCustomerSelectedLabel: {
    defaultMessage: "Send gift card to customer",
    description: "GiftCardSendToCustomer send to customer selected label"
  },
  customerSubtitle: {
    defaultMessage:
      "Selected customer will be sent the generated gift card code. Someone else can redeem the gift card code. Gift card will be assigned to account which redeemed the code.",
    description: "GiftCardCreateDialog customer subtitle"
  },
  customerChannelSubtitle: {
    defaultMessage:
      "Customer will be sent the gift card code via this channels email address",
    description: "GiftCardCreateDialog customer channel subtitle"
  },
  channelSelectLabel: {
    defaultMessage: "Channel",
    description: "GiftCardCreateDialog channel select label"
  }
});
