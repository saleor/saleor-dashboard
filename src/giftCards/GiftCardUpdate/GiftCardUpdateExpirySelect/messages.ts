import { defineMessages } from "react-intl";

export const giftCardExpirySelectMessages = defineMessages({
  expiryToggleTitle: {
    id: "uZ6MLe",
    defaultMessage: "Expiration date",
    description: "gift card expiry toggle title",
  },
  expiryToggleDescription: {
    id: "Yhdi+j",
    defaultMessage:
      "When enabled, the card stops working after this date. Leave off for a card that never expires. Default expiry for gift cards customers buy is configured in {settingsLink}.",
    description: "gift card expiry toggle description with link to gift card settings",
  },
  expirySettingsLink: {
    id: "UjvQOS",
    defaultMessage: "gift card settings",
    description: "gift card expiry toggle, link text to gift card settings page",
  },
  expiryDateFieldLabel: {
    id: "d0YXCw",
    defaultMessage: "Expires on",
    description: "gift card expiry nested date field label",
  },
  expiredOnLabel: {
    id: "//k1GX",
    defaultMessage: "Expired on {date}",
    description: "expired on label",
  },
});
