import { defineMessages } from "react-intl";

export const giftCardEnableDisableSectionMessages = defineMessages({
  successfullyEnabledTitle: {
    defaultMessage: "Successfully enabled gift card",
    description: "success gift card enable message"
  },
  successfullyDisabledTitle: {
    defaultMessage: "Successfully disabled gift card",
    description: "success gift card disable message"
  }
});

export const giftCardUpdatePageHeaderMessages = defineMessages({
  resendButtonLabel: {
    defaultMessage: "Resend code",
    description: "resend code label"
  },
  expiredStatusLabel: {
    defaultMessage: "Expired",
    description: "expired status label"
  },
  disabledStatusLabel: {
    defaultMessage: "Disabled",
    description: "disabled status label"
  }
});
