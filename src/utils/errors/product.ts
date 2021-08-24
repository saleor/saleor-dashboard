import { BulkProductErrorFragment } from "@saleor/fragments/types/BulkProductErrorFragment";
import { CollectionErrorFragment } from "@saleor/fragments/types/CollectionErrorFragment";
import { ProductErrorFragment } from "@saleor/fragments/types/ProductErrorFragment";
import { ProductErrorCode } from "@saleor/types/globalTypes";
import { defineMessages, IntlShape } from "react-intl";

import commonErrorMessages, { getCommonFormFieldErrorMessage } from "./common";

const messages = defineMessages({
  alreadyExists: {
    defaultMessage: "A product with this SKU already exists"
  },
  attributeAlreadyAssigned: {
    defaultMessage:
      "This attribute has already been assigned to this product type"
  },
  attributeCannotBeAssigned: {
    defaultMessage: "This attribute cannot be assigned to this product type"
  },
  attributeRequired: {
    defaultMessage: "All attributes should have value",
    description: "product attribute error"
  },
  attributeVariantsDisabled: {
    defaultMessage: "Variants are disabled in this product type"
  },
  duplicated: {
    defaultMessage: "The same object cannot be in both lists"
  },
  duplicatedInputItem: {
    defaultMessage: "Variant with these attributes already exists"
  },
  nameAlreadyTaken: {
    defaultMessage: "This name is already taken. Please provide another."
  },
  priceInvalid: {
    defaultMessage: "Product price cannot be lower than 0."
  },
  skuUnique: {
    defaultMessage: "SKUs must be unique",
    description: "bulk variant create error"
  },
  unsupportedMediaProvider: {
    defaultMessage: "Unsupported media provider or incorrect URL"
  },
  variantNoDigitalContent: {
    defaultMessage: "This variant does not have any digital content"
  },
  variantUnique: {
    defaultMessage: "This variant already exists",
    description: "product attribute error"
  },
  noCategorySet: {
    defaultMessage: "Product category not set",
    description: "no category set error"
  }
});

function getProductErrorMessage(
  err:
    | Omit<ProductErrorFragment | CollectionErrorFragment, "__typename">
    | undefined,
  intl: IntlShape
): string {
  if (err) {
    switch (err.code) {
      case ProductErrorCode.ATTRIBUTE_ALREADY_ASSIGNED:
        return intl.formatMessage(messages.attributeAlreadyAssigned);
      case ProductErrorCode.ALREADY_EXISTS:
        return intl.formatMessage(messages.alreadyExists);
      case ProductErrorCode.ATTRIBUTE_CANNOT_BE_ASSIGNED:
        return intl.formatMessage(messages.attributeCannotBeAssigned);
      case ProductErrorCode.ATTRIBUTE_VARIANTS_DISABLED:
        return intl.formatMessage(messages.attributeVariantsDisabled);
      case ProductErrorCode.DUPLICATED_INPUT_ITEM:
        return intl.formatMessage(messages.duplicatedInputItem);
      case ProductErrorCode.VARIANT_NO_DIGITAL_CONTENT:
        return intl.formatMessage(messages.variantNoDigitalContent);
      case ProductErrorCode.UNSUPPORTED_MEDIA_PROVIDER:
        return intl.formatMessage(messages.unsupportedMediaProvider);
      case ProductErrorCode.PRODUCT_WITHOUT_CATEGORY:
        return intl.formatMessage(messages.noCategorySet);
      case ProductErrorCode.INVALID:
        if (err.field === "price") {
          return intl.formatMessage(messages.priceInvalid);
        }
        return intl.formatMessage(commonErrorMessages.invalid);
      case ProductErrorCode.UNIQUE:
        if (err.field === "sku") {
          return intl.formatMessage(messages.skuUnique);
        }
    }
  }
  return getCommonFormFieldErrorMessage(err, intl);
}

export function getProductVariantAttributeErrorMessage(
  err: Omit<ProductErrorFragment, "__typename"> | undefined,
  intl: IntlShape
): string {
  if (err) {
    switch (err.code) {
      case ProductErrorCode.UNIQUE:
        return intl.formatMessage(messages.variantUnique);
      default:
        return getProductErrorMessage(err, intl);
    }
  }

  return undefined;
}

export function getBulkProductErrorMessage(
  err: BulkProductErrorFragment | undefined,
  intl: IntlShape
): string {
  if (err?.code === ProductErrorCode.UNIQUE && err.field === "sku") {
    return intl.formatMessage(messages.skuUnique);
  }
  return getProductErrorMessage(err, intl);
}

export default getProductErrorMessage;
