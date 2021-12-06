import { defineMessages } from "react-intl";

export const giftCardSendToCustomerMessages = defineMessages({
  sendToCustomerSelectedLabel: {
    id: "9v70Gd",
    defaultMessage: "Send gift card to customer",
    description: "GiftCardSendToCustomer send to customer selected label"
  },
  customerSubtitle: {
    id: "HgPWiL",
    defaultMessage:
      "Selected customer will be sent the generated gift card code. Someone else can redeem the gift card code. Gift card will be assigned to account which redeemed the code.",
    description: "GiftCardCreateDialog customer subtitle"
  },
  customerChannelSubtitle: {
    id: "SJg46F",
    defaultMessage:
      "Customer will be sent the gift card code via this channels email address",
    description: "GiftCardCreateDialog customer channel subtitle"
  },
  channelSelectLabel: {
    id: "4rNc3Q",
    defaultMessage: "Channel",
    description: "GiftCardCreateDialog channel select label"
  }
});
