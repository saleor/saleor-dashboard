import { PageErrorCode, PageErrorFragment } from "@saleor/graphql";
import { defineMessages, IntlShape } from "react-intl";

import { getCommonFormFieldErrorMessage } from "./common";

const messages = defineMessages({
  attributeAlreadyAssigned: {
    defaultMessage: "This attribute is already assigned.",
    description: "error message"
  },
  duplicatedInputItem: {
    defaultMessage: "Page with these attributes already exists.",
    description: "error message"
  },
  nameAlreadyTaken: {
    defaultMessage: "This name is already taken. Please provide another.",
    description: "error message"
  },
  notFound: {
    defaultMessage: "Page not found.",
    description: "error message"
  }
});

function getPageErrorMessage(
  err: Omit<PageErrorFragment, "__typename"> | undefined,
  intl: IntlShape
): string {
  if (err) {
    switch (err.code) {
      case PageErrorCode.UNIQUE:
        return intl.formatMessage(messages.nameAlreadyTaken);
      case PageErrorCode.ATTRIBUTE_ALREADY_ASSIGNED:
        return intl.formatMessage(messages.attributeAlreadyAssigned);
      case PageErrorCode.DUPLICATED_INPUT_ITEM:
        return intl.formatMessage(messages.duplicatedInputItem);
      case PageErrorCode.NOT_FOUND:
        return intl.formatMessage(messages.notFound);
    }
  }

  return getCommonFormFieldErrorMessage(err, intl);
}

export default getPageErrorMessage;
