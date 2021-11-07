import { SetPasswordData } from "@saleor/sdk";
import { AccountErrorCode } from "@saleor/types/globalTypes";
import { defineMessages, IntlShape } from "react-intl";

import { getCommonFormFieldErrorMessage } from "./common";

const messages = defineMessages({
  invalidPassword: {
    defaultMessage: "Invalid password"
  },
  outOfScopeGroup: {
    defaultMessage: "Group is out of your permission scope"
  },
  outOfScopeUser: {
    defaultMessage: "User is out of your permissions scope"
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
  },
  unique: {
    defaultMessage: "This needs to be unique"
  }
});

interface ErrorFragment {
  code: AccountErrorCode | SetPasswordData["errors"][number]["code"];
}

function getAccountErrorMessage(err: ErrorFragment, intl: IntlShape): string {
  if (err) {
    switch (err.code) {
      case AccountErrorCode.INVALID_PASSWORD:
        return intl.formatMessage(messages.invalidPassword);
      case AccountErrorCode.OUT_OF_SCOPE_USER:
        return intl.formatMessage(messages.outOfScopeUser);
      case AccountErrorCode.OUT_OF_SCOPE_GROUP:
        return intl.formatMessage(messages.outOfScopeGroup);
      case AccountErrorCode.PASSWORD_ENTIRELY_NUMERIC:
        return intl.formatMessage(messages.passwordNumeric);
      case AccountErrorCode.PASSWORD_TOO_COMMON:
        return intl.formatMessage(messages.tooCommon);
      case AccountErrorCode.PASSWORD_TOO_SHORT:
        return intl.formatMessage(messages.tooShort);
      case AccountErrorCode.PASSWORD_TOO_SIMILAR:
        return intl.formatMessage(messages.tooSimilar);
      case AccountErrorCode.UNIQUE:
        return intl.formatMessage(messages.unique);
    }
  }

  return getCommonFormFieldErrorMessage(err, intl);
}

export default getAccountErrorMessage;
