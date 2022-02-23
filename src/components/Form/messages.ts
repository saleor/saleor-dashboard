import { defineMessages } from "react-intl";

export const exitFormPromptMessages = defineMessages({
  title: {
    defaultMessage: "Are you sure you want to leave?",
    description: "ExitFormPrompt title"
  },
  description: {
    defaultMessage:
      "You have unsaved changes on this view. What would you like to do with them?",
    description: "ExitFormPrompt description"
  },
  cancelButton: {
    defaultMessage: "Leave without saving",
    description: "ExitFormPrompt cancel button"
  },
  confirmButton: {
    defaultMessage: "Save & continue",
    description: "ExitFormPrompt confirm button"
  }
});
