import { defineMessages } from "react-intl";

const confirmation = defineMessages({
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
const permissionsPicker = defineMessages({
  closeButton: {
    defaultMessage: "Close",
    id: "rbrahO",
  },
  saveButton: {
    defaultMessage: "Save",
    id: "jvo0vs",
  },
});
const dialogRoot = defineMessages({
  heading: {
    defaultMessage: "Edit permissions",
    id: "psmnv9",
  },
  info: {
    defaultMessage: "Manually change permission for the app.",
    id: "6uy2gU",
  },
  warningHeading: {
    defaultMessage: "Warning",
    id: "3SVI5p",
  },
  warningParagraph1: {
    defaultMessage: "Adding permission allows app to have more access to your data.",
    id: "azj0kR",
  },
  warningParagraph2: {
    defaultMessage: "Removing permissions may cause app to break.",
    id: "abpvEI",
  },
  successNotificationTitle: {
    defaultMessage: "Success",
    id: "xrKHS6",
  },
  successNotificationBody: {
    defaultMessage: "Updated app permissions",
    id: "47hJzu",
  },
  fallbackErrorText: {
    defaultMessage: "Failed to save permissions. Refresh the page and try again.",
    id: "hAoqp6",
  },
});

export const AppPermissionsDialogMessages = {
  confirmation,
  permissionsPicker,
  dialogRoot,
};
