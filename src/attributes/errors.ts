import { AttributeErrorCode, AttributeErrorFragment } from "@dashboard/graphql";
import getAttributeErrorMessage from "@dashboard/utils/errors/attribute";
import { defineMessages, IntlShape } from "react-intl";

const messages = defineMessages({
  attributeSlugUnique: {
    id: "eWV760",
    defaultMessage: "Attribute with this slug already exists",
  },
  attributeValueAlreadyExists: {
    id: "J/QqOI",
    defaultMessage: "This value already exists within this attribute",
  },
});

export function getAttributeSlugErrorMessage(
  err: AttributeErrorFragment | undefined,
  intl: IntlShape,
): string | undefined {
  switch (err?.code) {
    case AttributeErrorCode.UNIQUE:
      return intl.formatMessage(messages.attributeSlugUnique);
    default:
      return getAttributeErrorMessage(err, intl);
  }
}

export function getAttributeValueErrorMessage(
  err: AttributeErrorFragment | undefined,
  intl: IntlShape,
): string | undefined {
  switch (err?.code) {
    case AttributeErrorCode.ALREADY_EXISTS:
      return intl.formatMessage(messages.attributeValueAlreadyExists);
    default:
      return getAttributeErrorMessage(err, intl);
  }
}
