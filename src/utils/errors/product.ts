import { IntlShape, defineMessages } from "react-intl";

import { ProductErrorFragment } from "@saleor/attributes/types/ProductErrorFragment";
import { ProductErrorCode } from "@saleor/types/globalTypes";
import { commonMessages } from "@saleor/intl";
import commonErrorMessages from "./common";

const messages = defineMessages({
  attributeAlreadyAssigned: {
    defaultMessage:
      "This attribute has already been assigned to this product type"
  },
  attributeCannotBeAssigned: {
    defaultMessage: "This attribute cannot be assigned to this product type"
  },
  attributeVariantsDisabled: {
    defaultMessage: "Variants are disabled in this product type"
  },
  variantNoDigitalContent: {
    defaultMessage: "This variant does not have any digital content"
  }
});

function getProductErrorMessage(
  err: ProductErrorFragment,
  intl: IntlShape
): string {
  if (err) {
    switch (err.code) {
      case ProductErrorCode.ATTRIBUTE_ALREADY_ASSIGNED:
        return intl.formatMessage(messages.attributeAlreadyAssigned);
      case ProductErrorCode.ATTRIBUTE_CANNOT_BE_ASSIGNED:
        return intl.formatMessage(messages.attributeCannotBeAssigned);
      case ProductErrorCode.ATTRIBUTE_VARIANTS_DISABLED:
        return intl.formatMessage(messages.attributeVariantsDisabled);
      case ProductErrorCode.GRAPHQL_ERROR:
        return intl.formatMessage(commonErrorMessages.graphqlError);
      case ProductErrorCode.REQUIRED:
        return intl.formatMessage(commonMessages.requiredField);
      case ProductErrorCode.VARIANT_NO_DIGITAL_CONTENT:
        return intl.formatMessage(messages.variantNoDigitalContent);
      default:
        return intl.formatMessage(commonErrorMessages.unknownError);
    }
  }

  return undefined;
}

export default getProductErrorMessage;
