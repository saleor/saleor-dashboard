import { defineMessages } from "react-intl";

export const confirmation = defineMessages({
  summaryText: {
    defaultMessage: "You are going to",
    id: "PlAdWI",
  },
  addPermissions: {
    defaultMessage: "Add following permissions",
    id: "oboeOT",
  },
  removePermissions: {
    defaultMessage: "Remove following permissions:",
    id: "SceSNp",
  },
  backButton: {
    defaultMessage: "Go back",
    id: "orvpWh",
  },
  confirmButton: {
    defaultMessage: "I know what I'm doing - confirm",
    id: "cS1wAx",
  },
});

export const permissionsPicker = defineMessages({
  closeButton: {
    defaultMessage: "Close",
    id: "rbrahO",
  },
  saveButton: {
    defaultMessage: "Save",
    id: "jvo0vs",
  },
});

export const AppPermissionsDialogMessages = {
  confirmation,
  permissionsPicker,
};
