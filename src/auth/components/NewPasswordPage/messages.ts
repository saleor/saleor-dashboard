import { defineMessages } from "react-intl";

export const newPasswordPageMessages = defineMessages({
  title: {
    id: "F/uQnO",
    defaultMessage: "Set new password",
    description: "page title",
  },
  description: {
    id: "dwE5UC",
    defaultMessage: "Choose a password you don’t use anywhere else.",
  },
  newPasswordLabel: {
    id: "fTHhSB",
    defaultMessage: "New password",
  },
  confirmPasswordLabel: {
    id: "8HimVK",
    defaultMessage: "Confirm password",
  },
  showPassword: {
    id: "eLl71O",
    defaultMessage: "Show password",
    description: "aria-label for new password visibility toggle button",
  },
  hidePassword: {
    id: "NMw7ip",
    defaultMessage: "Hide password",
    description: "aria-label for new password visibility toggle button",
  },
  submitButton: {
    id: "S22jIs",
    defaultMessage: "Set new password",
    description: "button",
  },
  passwordHint: {
    id: "6tg2dD",
    defaultMessage: "Use 8 or more characters.",
    description: "password guidance below set new password button",
  },
});

export const newPasswordValidationMessages = defineMessages({
  passwordRequired: {
    id: "y+XIPY",
    defaultMessage: "Password is required",
    description: "validation error",
  },
  passwordsDoNotMatch: {
    id: "7Chrsf",
    defaultMessage: "Passwords do not match",
  },
});
