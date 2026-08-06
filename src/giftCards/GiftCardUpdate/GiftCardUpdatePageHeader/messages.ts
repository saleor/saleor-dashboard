import { defineMessages } from "react-intl";

export const giftCardEnableDisableSectionMessages = defineMessages({
  successfullyEnabledTitle: {
    id: "Hz9Ll0",
    defaultMessage: "Gift card activated",
    description: "success gift card activate message",
  },
  successfullyDisabledTitle: {
    id: "j2DRaI",
    defaultMessage: "Gift card deactivated",
    description: "success gift card deactivate message",
  },
});

export const giftCardUpdatePageHeaderMessages = defineMessages({
  resendButtonLabel: {
    id: "lCPxtT",
    defaultMessage: "Resend code",
    description: "resend code label",
  },
  openGraphiQL: {
    id: "YNhhZh",
    defaultMessage: "Open this gift card in GraphiQL",
  },
  deleteGiftCard: {
    id: "eEXfCE",
    defaultMessage: "Delete gift card",
    description: "gift card detail cogs menu, opens the delete-confirmation dialog",
  },
  editGiftCardMetadata: {
    id: "xbgJHS",
    defaultMessage: "Edit gift card metadata",
    description: "gift card detail page, top-bar metadata button tooltip",
  },
});
