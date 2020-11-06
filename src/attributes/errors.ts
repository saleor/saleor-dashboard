import { AttributeErrorFragment } from "@saleor/fragments/types/AttributeErrorFragment";
import { AttributeErrorCode } from "@saleor/types/globalTypes";
import getAttributeErrorMessage from "@saleor/utils/errors/attribute";
import { defineMessages, IntlShape } from "react-intl";

const messages = defineMessages({
  attributeSlugUnique: {
    defaultMessage: "Attribute with this slug already exists"
  },
  attributeValueAlreadyExists: {
    defaultMessage: "This value already exists within this attribute"
  }
});

export function getAttributeSlugErrorMessage(
  err: AttributeErrorFragment,
  intl: IntlShape
): string {
  switch (err?.code) {
    case AttributeErrorCode.UNIQUE:
      return intl.formatMessage(messages.attributeSlugUnique);
    default:
      return getAttributeErrorMessage(err, intl);
  }
}

export function getAttributeValueErrorMessage(
  err: AttributeErrorFragment,
  intl: IntlShape
): string {
  switch (err?.code) {
    case AttributeErrorCode.ALREADY_EXISTS:
      return intl.formatMessage(messages.attributeValueAlreadyExists);
    default:
      return getAttributeErrorMessage(err, intl);
  }
}
