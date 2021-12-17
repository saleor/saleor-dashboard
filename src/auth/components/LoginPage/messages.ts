import { UserContextError } from "@saleor/auth/types";
import { defineMessages, IntlShape } from "react-intl";

export const errorMessages = defineMessages({
  loginError: {
    defaultMessage:
      "Sorry, your username and/or password are incorrect. Please try again.",
    description: "error message"
  },
  externalLoginError: {
    defaultMessage: "Sorry, login went wrong. Please try again.",
    description: "error message"
  },
  serverError: {
    defaultMessage:
      "Saleor is unavailable, please check your network connection and try again.",
    description: "error message"
  }
});

export function getErrorMessage(
  err: UserContextError,
  intl: IntlShape
): string {
  switch (err) {
    case "loginError":
      return intl.formatMessage(errorMessages.loginError);
    case "externalLoginError":
      return intl.formatMessage(errorMessages.externalLoginError);
    case "serverError":
      return intl.formatMessage(errorMessages.serverError);
  }
}
