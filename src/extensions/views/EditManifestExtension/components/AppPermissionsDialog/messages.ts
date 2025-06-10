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
    defaultMessage: "Manually change permission for the extension.",
    id: "XJm60a",
  },
  warningHeading: {
    defaultMessage: "Warning",
    id: "3SVI5p",
  },
  warningParagraph1: {
    defaultMessage: "Adding permission allows extension to have more access to your data.",
    id: "URUNhT",
  },
  warningParagraph2: {
    defaultMessage: "Removing permissions may cause extension to break.",
    id: "4y3Smi",
  },
  successNotificationTitle: {
    defaultMessage: "Success",
    id: "xrKHS6",
  },
  successNotificationBody: {
    defaultMessage: "Updated extension permissions",
    id: "6Y1YDn",
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
