import { defineMessages } from "react-intl";

export const newPasswordPageMessages = defineMessages({
  title: {
    id: "WhKGPA",
    defaultMessage: "Set up new password",
    description: "page title",
  },
  description: {
    id: "m0Dz+2",
    defaultMessage:
      "Please set up a new password for your account. Repeat your new password to make sure you will be able to remember it.",
  },
  newPasswordLabel: {
    id: "Ev6SEF",
    defaultMessage: "New Password",
  },
  confirmPasswordLabel: {
    id: "vfG+nh",
    defaultMessage: "Confirm Password",
  },
  submitButton: {
    id: "S22jIs",
    defaultMessage: "Set new password",
    description: "button",
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
