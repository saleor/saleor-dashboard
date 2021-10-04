import { defineMessages } from "react-intl";

export const bulkEnableDisableSectionMessages = defineMessages({
  enableLabel: {
    defaultMessage: "Activate",
    description: "GiftCardEnableDisableSection enable label"
  },
  disableLabel: {
    defaultMessage: "Deactivate",
    description: "GiftCardEnableDisableSection enable label"
  },
  deleteLabel: {
    defaultMessage: "Delete",
    description: "GiftCardEnableDisableSection enable label"
  },
  successActivateAlertText: {
    defaultMessage:
      "Successfully activated gift {count,plural,one{card} other{cards}}",
    description: "GiftCardEnableDisableSection success activate alert text"
  },
  successDeactivateAlertText: {
    defaultMessage:
      "Successfully deactivated gift {count,plural,one{card} other{cards}}",
    description: "GiftCardEnableDisableSection success activate alert text"
  },
  errorActivateAlertText: {
    defaultMessage:
      "Error activating gift {count,plural,one{card} other{cards}}",
    description: "GiftCardEnableDisableSection error activate alert text"
  },
  errorDeactivateAlertText: {
    defaultMessage:
      "Errors deactivating gift {count,plural,one{card} other{cards}}",
    description: "GiftCardEnableDisableSection error activate alert text"
  }
});
