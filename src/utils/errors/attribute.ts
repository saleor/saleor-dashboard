import { AttributeErrorCode, AttributeErrorFragment } from "@saleor/graphql";
import { defineMessages, IntlShape } from "react-intl";

import { getCommonFormFieldErrorMessage } from "./common";

const messages = defineMessages({
  alreadyExists: {
    id: "KFv8hX",
    defaultMessage: "An attribute already exists.",
  },
  nameAlreadyTaken: {
    id: "FuAV5G",
    defaultMessage: "This name is already taken. Please provide another.",
  },
  notFound: {
    id: "SKFr04",
    defaultMessage: "Attribute not found.",
  },
});

function getAttributeErrorMessage(
  err: Omit<AttributeErrorFragment, "__typename"> | undefined,
  intl: IntlShape,
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
