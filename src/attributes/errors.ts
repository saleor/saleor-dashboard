import { ProductErrorCode } from "@saleor/types/globalTypes";
import { getProductErrorMessage } from "@saleor/utils/errors";
import { defineMessages, IntlShape } from "react-intl";

import { ProductErrorFragment } from "./types/ProductErrorFragment";

const messages = defineMessages({
  attributeSlugUnique: {
    defaultMessage: "Attribute with this slug already exists"
  },
  attributeValueAlreadyExists: {
    defaultMessage: "This value already exists within this attribute"
  }
});

export function getAttributeSlugErrorMessage(
  err: ProductErrorFragment,
  intl: IntlShape
): string {
  switch (err?.code) {
    case ProductErrorCode.UNIQUE:
      return intl.formatMessage(messages.attributeSlugUnique);
    default:
      return getProductErrorMessage(err, intl);
  }
}

export function getAttributeValueErrorMessage(
  err: ProductErrorFragment,
  intl: IntlShape
): string {
  switch (err?.code) {
    case ProductErrorCode.ALREADY_EXISTS:
      return intl.formatMessage(messages.attributeValueAlreadyExists);
    default:
      return getProductErrorMessage(err, intl);
  }
}
