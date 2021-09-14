import { AttributeErrorFragment } from "@saleor/fragments/types/AttributeErrorFragment";
import { AttributeErrorCode } from "@saleor/types/globalTypes";
import { defineMessages, IntlShape } from "react-intl";

import { getCommonFormFieldErrorMessage } from "./common";

const messages = defineMessages({
  alreadyExists: {
    defaultMessage: "An attribute already exists."
  },
  nameAlreadyTaken: {
    defaultMessage: "This name is already taken. Please provide another."
  },
  notFound: {
    defaultMessage: "Attribute not found."
  }
});

function getAttributeErrorMessage(
  err: Omit<AttributeErrorFragment, "__typename"> | undefined,
  intl: IntlShape
): string {
  if (err) {
    switch (err.code) {
      case AttributeErrorCode.ALREADY_EXISTS:
        return intl.formatMessage(messages.alreadyExists);
      case AttributeErrorCode.UNIQUE:
        return intl.formatMessage(messages.nameAlreadyTaken);
      case AttributeErrorCode.NOT_FOUND:
        return intl.formatMessage(messages.notFound);
    }
  }

  return getCommonFormFieldErrorMessage(err, intl);
}

export default getAttributeErrorMessage;
