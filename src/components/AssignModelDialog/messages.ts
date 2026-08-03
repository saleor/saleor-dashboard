import { defineMessages } from "react-intl";

export const messages = defineMessages({
  assignModelDialogHeader: {
    id: "OpgSjI",
    defaultMessage: "Assign Model",
    description: "dialog header",
  },
  assignModelDialogButton: {
    id: "X1WqwZ",
    defaultMessage: "Assign and save",
    description: "button, assign models and save",
  },
  assignModelDialogContent: {
    id: "fEeZGG",
    defaultMessage: "Search Models",
  },
  assignModelDialogSearch: {
    id: "R4gIJc",
    defaultMessage: "Search by model name...",
  },
  noModelsFound: {
    id: "L7j412",
    defaultMessage: "No models found",
    description: "no models placeholder",
  },
  noModelsAvailable: {
    id: "wBRaTi",
    defaultMessage: "No models available",
    description: "no models placeholder",
  },
  allLoadedModelsFilteredOut: {
    id: "qFCc+k",
    defaultMessage:
      "Every model loaded so far is already assigned. Search by name, or keep loading the list.",
    description: "assign model picker, client-side filter emptied the loaded pages",
  },
});
