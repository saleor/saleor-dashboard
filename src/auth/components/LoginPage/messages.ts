import { type UserContextError } from "@dashboard/auth/types";
import { defineMessages, type IntlShape } from "react-intl";

export const loginPageMessages = defineMessages({
  signInHeader: {
    id: "VfzAVN",
    defaultMessage: "Welcome back",
    description: "login page heading",
  },
  signInSubtitle: {
    id: "VYdDDs",
    defaultMessage: "Log in to your Saleor Dashboard.",
    description: "login page subtitle",
  },
  passwordLabel: {
    id: "5sg7KC",
    defaultMessage: "Password",
  },
  showPassword: {
    id: "OvAlM0",
    defaultMessage: "Show password",
    description: "aria-label for password visibility toggle button",
  },
  hidePassword: {
    id: "LYu01+",
    defaultMessage: "Hide password",
    description: "aria-label for password visibility toggle button",
  },
  forgotPassword: {
    id: "3tbL7x",
    defaultMessage: "Forgot password?",
    description: "description",
  },
  signInButton: {
    id: "47logQ",
    defaultMessage: "Log in",
    description: "button",
  },
  orDivider: {
    id: "6ZNHWw",
    defaultMessage: "or",
    description: "divider between password sign-in and external SSO methods",
  },
  loadingLoginMethods: {
    id: "tZ+8E3",
    defaultMessage: "Loading login methods",
    description: "spinner aria label on login page",
  },
  loginMethodsUnavailable: {
    id: "/c0Gdp",
    defaultMessage: "Couldn't load login methods. Check your connection and try again.",
    description: "error shown on login page when available login methods failed to load",
  },
  passwordLoginDisabled: {
    id: "BtsJ+e",
    defaultMessage:
      "Password login is disabled. Contact your administrator to configure an external authentication method or enable password login.",
    description: "empty state message when no login method is available",
  },
  needHelp: {
    id: "N0dWxf",
    defaultMessage: "Need help? {contactLink}",
    description: "support prompt below sign-in card",
  },
  contactSupport: {
    id: "sfF32h",
    defaultMessage: "Contact support",
    description: "support link label below sign-in card",
  },
});

const errorMessages = defineMessages({
  loginError: {
    id: "FopBSj",
    defaultMessage: "Your username and/or password are incorrect. Please try again.",
    description: "error message",
  },
  unknownLoginError: {
    id: "Wr5UOV",
    defaultMessage: "Login went wrong. Please try again.",
    description: "error message",
  },
  serverError: {
    id: "ChGI4V",
    defaultMessage: "Saleor is unavailable, please check your network connection and try again.",
    description: "error message",
  },
  noPermissionsError: {
    id: "7Jg9ec",
    defaultMessage: "You don't have permission to login.",
    description: "error message",
  },
  loginAttemptDelay: {
    defaultMessage: "Please wait a moment before trying again.",
    description: "error message",
    id: "RyZd9J",
  },
});

export function getErrorMessage(err: UserContextError, intl: IntlShape): string {
  switch (err) {
    case "loginError":
    case "invalidCredentials":
      return intl.formatMessage(errorMessages.loginError);
    case "externalLoginError":
    case "unknownLoginError":
      return intl.formatMessage(errorMessages.unknownLoginError);
    case "serverError":
      return intl.formatMessage(errorMessages.serverError);
    case "noPermissionsError":
      return intl.formatMessage(errorMessages.noPermissionsError);
    case "loginAttemptDelay":
      return intl.formatMessage(errorMessages.loginAttemptDelay);
    default: {
      const _exhaustive: never = err;

      return _exhaustive ?? intl.formatMessage(errorMessages.unknownLoginError);
    }
  }
}
