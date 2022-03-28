import { defineMessages } from "react-intl";

export const exitFormPromptMessages = defineMessages({
  title: {
    defaultMessage: "Would you like to save changes?",
    description: "ExitFormPrompt title"
  },
  unableToSaveTitle: {
    defaultMessage: "You have unsaved changes",
    description: "ExitFormPrompt title"
  },
  cancelButton: {
    defaultMessage: "Discard changes",
    description: "ExitFormPrompt cancel button"
  },
  confirmButton: {
    defaultMessage: "Save changes",
    description: "ExitFormPrompt confirm button"
  },
  continueEditingButton: {
    defaultMessage: "Continue editing",
    description: "ExitFormPrompt continue editing button"
  }
});
