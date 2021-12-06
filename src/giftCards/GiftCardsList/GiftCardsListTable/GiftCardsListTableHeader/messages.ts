import { defineMessages } from "react-intl";

export const bulkEnableDisableSectionMessages = defineMessages({
  enableLabel: {
    id: "84HGDp",
    defaultMessage: "Activate",
    description: "GiftCardEnableDisableSection enable label"
  },
  disableLabel: {
    id: "vf4WvP",
    defaultMessage: "Deactivate",
    description: "GiftCardEnableDisableSection enable label"
  },
  successActivateAlertText: {
    id: "mEMGKm",
    defaultMessage:
      "Successfully activated gift {count,plural,one{card} other{cards}}",
    description: "GiftCardEnableDisableSection success activate alert text"
  },
  successDeactivateAlertText: {
    id: "Oobvs5",
    defaultMessage:
      "Successfully deactivated gift {count,plural,one{card} other{cards}}",
    description: "GiftCardEnableDisableSection success activate alert text"
  },
  errorActivateAlertText: {
    id: "wb6yRQ",
    defaultMessage:
      "Error activating gift {count,plural,one{card} other{cards}}",
    description: "GiftCardEnableDisableSection error activate alert text"
  },
  errorDeactivateAlertText: {
    id: "Jdp7I3",
    defaultMessage:
      "Errors deactivating gift {count,plural,one{card} other{cards}}",
    description: "GiftCardEnableDisableSection error activate alert text"
  }
});
