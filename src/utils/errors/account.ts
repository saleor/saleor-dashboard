import { IntlShape, defineMessages } from "react-intl";

import { AccountErrorCode } from "@saleor/types/globalTypes";
import { commonMessages } from "@saleor/intl";
import { AccountErrorFragment } from "@saleor/customers/types/AccountErrorFragment";
import commonErrorMessages from "./common";

const messages = defineMessages({
  invalidPassword: {
    defaultMessage: "Invalid password"
  },
  passwordNumeric: {
    defaultMessage: "Password cannot be entirely numeric"
  },
  tooCommon: {
    defaultMessage: "This password is too commonly used"
  },
  tooShort: {
    defaultMessage: "This password is too short"
  },
  tooSimilar: {
    defaultMessage: "These passwords are too similar"
  }
});

function getAccountErrorMessage(
  err: AccountErrorFragment,
  intl: IntlShape
): string {
  if (err) {
    switch (err.code) {
      case AccountErrorCode.GRAPHQL_ERROR:
        return intl.formatMessage(commonErrorMessages.graphqlError);
      case AccountErrorCode.INVALID:
        return intl.formatMessage(commonErrorMessages.invalid);
      case AccountErrorCode.INVALID_PASSWORD:
        return intl.formatMessage(messages.invalidPassword);
      case AccountErrorCode.PASSWORD_ENTIRELY_NUMERIC:
        return intl.formatMessage(messages.passwordNumeric);
      case AccountErrorCode.PASSWORD_TOO_COMMON:
        return intl.formatMessage(messages.tooCommon);
      case AccountErrorCode.PASSWORD_TOO_SHORT:
        return intl.formatMessage(messages.tooShort);
      case AccountErrorCode.PASSWORD_TOO_SIMILAR:
        return intl.formatMessage(messages.tooSimilar);
      case AccountErrorCode.REQUIRED:
        return intl.formatMessage(commonMessages.requiredField);
      default:
        return intl.formatMessage(commonErrorMessages.unknownError);
    }
  }

  return undefined;
}

export default getAccountErrorMessage;
