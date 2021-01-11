import { PageErrorFragment } from "@saleor/fragments/types/PageErrorFragment";
import { commonMessages } from "@saleor/intl";
import { PageErrorCode } from "@saleor/types/globalTypes";
import { defineMessages, IntlShape } from "react-intl";

import commonErrorMessages from "./common";

const messages = defineMessages({
  nameAlreadyTaken: {
    defaultMessage: "This name is already taken. Please provide another."
  }
});

function getPageErrorMessage(
  err: Omit<PageErrorFragment, "__typename"> | undefined,
  intl: IntlShape
): string {
  if (err) {
    switch (err.code) {
      case PageErrorCode.GRAPHQL_ERROR:
        return intl.formatMessage(commonErrorMessages.graphqlError);
      case PageErrorCode.REQUIRED:
        return intl.formatMessage(commonMessages.requiredField);
      case PageErrorCode.INVALID:
        return intl.formatMessage(commonErrorMessages.invalid);
      case PageErrorCode.UNIQUE:
        return intl.formatMessage(messages.nameAlreadyTaken);
      default:
        return intl.formatMessage(commonErrorMessages.unknownError);
    }
  }

  return undefined;
}

export default getPageErrorMessage;
