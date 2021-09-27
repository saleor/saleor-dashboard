import { defineMessages } from "react-intl";

export const giftCardEnableDisableSectionMessages = defineMessages({
  successfullyEnabledTitle: {
    defaultMessage: "Successfully enabled gift card",
    description: "GiftCardEnableDisableSection enable success"
  },
  successfullyDisabledTitle: {
    defaultMessage: "Successfully disabled gift card",
    description: "GiftCardEnableDisableSection disable success"
  }
});

export const giftCardUpdatePageHeaderMessages = defineMessages({
  resendButtonLabel: {
    defaultMessage: "Resend code",
    description: "giftCardUpdatePageHeader resendButtonLabel"
  },
  expiredStatusLabel: {
    defaultMessage: "Expired",
    description: "giftCardUpdatePageHeader expired status label"
  },
  disabledStatusLabel: {
    defaultMessage: "Disabled",
    description: "giftCardUpdatePageHeader disabled status label"
  }
});
