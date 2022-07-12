import { defineMessages } from "react-intl";

export const bulkEnableDisableSectionMessages = defineMessages({
  enableLabel: {
    id: "hz+9ES",
    defaultMessage: "Activate",
    description: "bulk activate label",
  },
  disableLabel: {
    id: "IzEVek",
    defaultMessage: "Deactivate",
    description: "bulk disable label",
  },
  deleteLabel: {
    id: "qkt/Km",
    defaultMessage: "Delete",
    description: "bulk delete label",
  },
  successActivateAlertText: {
    id: "IwEQvz",
    defaultMessage:
      "Successfully activated gift {count,plural,one{card} other{cards}}",
    description: "success activate alert message",
  },
  successDeactivateAlertText: {
    id: "SO56cv",
    defaultMessage:
      "Successfully deactivated gift {count,plural,one{card} other{cards}}",
    description: "success deactivate alert message",
  },
  errorActivateAlertText: {
    id: "KcsJKm",
    defaultMessage:
      "Error activating gift {count,plural,one{card} other{cards}}",
    description: "error with activatation alert message",
  },
  errorDeactivateAlertText: {
    id: "C90nKP",
    defaultMessage:
      "Errors deactivating gift {count,plural,one{card} other{cards}}",
    description: "error with deactivatation alert message",
  },
});
