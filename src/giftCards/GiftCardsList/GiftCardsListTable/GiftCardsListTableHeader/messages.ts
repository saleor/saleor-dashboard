import { defineMessages } from "react-intl";

export const bulkEnableDisableSectionMessages = defineMessages({
  enableLabel: {
    defaultMessage: "Activate",
    description: "bulk activate label"
  },
  disableLabel: {
    defaultMessage: "Deactivate",
    description: "bulk disable label"
  },
  deleteLabel: {
    defaultMessage: "Delete",
    description: "bulk delete label"
  },
  successActivateAlertText: {
    defaultMessage:
      "Successfully activated gift {count,plural,one{card} other{cards}}",
    description: "success activate alert message"
  },
  successDeactivateAlertText: {
    defaultMessage:
      "Successfully deactivated gift {count,plural,one{card} other{cards}}",
    description: "success deactivate alert message"
  },
  errorActivateAlertText: {
    defaultMessage:
      "Error activating gift {count,plural,one{card} other{cards}}",
    description: "error with activatation alert message"
  },
  errorDeactivateAlertText: {
    defaultMessage:
      "Errors deactivating gift {count,plural,one{card} other{cards}}",
    description: "error with deactivatation alert message"
  }
});
