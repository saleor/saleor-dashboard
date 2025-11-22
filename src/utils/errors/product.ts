import {
  CollectionErrorFragment,
  ProductChannelListingErrorFragment,
  ProductErrorCode,
  ProductErrorFragment,
} from "@dashboard/graphql";
import { defineMessages, IntlShape } from "react-intl";

import commonErrorMessages, { getCommonFormFieldErrorMessage } from "./common";

const messages = defineMessages({
  alreadyExists: {
    id: "2NgTCJ",
    defaultMessage: "A product with this SKU already exists",
  },
  attributeAlreadyAssigned: {
    id: "aggaJg",
    defaultMessage: "This attribute has already been assigned to this product type",
  },
  attributeCannotBeAssigned: {
    id: "u24Ppd",
    defaultMessage: "This attribute cannot be assigned to this product type",
  },
  attributeRequired: {
    id: "cd13nN",
    defaultMessage: "All attributes should have value",
    description: "product attribute error",
  },
  attributeVariantsDisabled: {
    id: "lLwtgs",
    defaultMessage: "Variants are disabled in this product type",
  },
  duplicated: {
    id: "AY7Tuz",
    defaultMessage: "The same object cannot be in both lists",
  },
  duplicatedInputItem: {
    id: "pFVX6g",
    defaultMessage: "Variant with these attributes already exists",
  },
  nameAlreadyTaken: {
    id: "FuAV5G",
    defaultMessage: "This name is already taken. Please provide another.",
  },
  priceInvalid: {
    id: "mYs3tb",
    defaultMessage: "Product price cannot be lower than 0.",
  },
  skuUnique: {
    id: "rZf1qL",
    defaultMessage: "SKUs must be unique",
    description: "bulk variant create error",
  },
  unsupportedMediaProvider: {
    id: "DILs4b",
    defaultMessage: "Unsupported media provider or incorrect URL",
  },
  variantNoDigitalContent: {
    id: "Z6QAbw",
    defaultMessage: "This variant does not have any digital content",
  },
  variantUnique: {
    id: "i3Mvj8",
    defaultMessage: "This variant already exists",
    description: "product attribute error",
  },
  noCategorySet: {
    id: "3AqOxp",
    defaultMessage: "Product category not set",
    description: "no category set error",
  },
});

function getProductErrorMessage(
  err:
    | Omit<
        ProductErrorFragment | CollectionErrorFragment | ProductChannelListingErrorFragment,
        "__typename"
      >
    | undefined,
  intl: IntlShape,
): string | undefined {
  if (err) {
    switch (err.code) {
      case "ATTRIBUTE_ALREADY_ASSIGNED":
        return intl.formatMessage(messages.attributeAlreadyAssigned);
      case "ALREADY_EXISTS":
        return intl.formatMessage(messages.alreadyExists);
      case "ATTRIBUTE_CANNOT_BE_ASSIGNED":
        return intl.formatMessage(messages.attributeCannotBeAssigned);
      case "ATTRIBUTE_VARIANTS_DISABLED":
        return intl.formatMessage(messages.attributeVariantsDisabled);
      case "DUPLICATED_INPUT_ITEM":
        return intl.formatMessage(messages.duplicatedInputItem);
      case "VARIANT_NO_DIGITAL_CONTENT":
        return intl.formatMessage(messages.variantNoDigitalContent);
      case "UNSUPPORTED_MEDIA_PROVIDER":
        return intl.formatMessage(messages.unsupportedMediaProvider);
      case "PRODUCT_WITHOUT_CATEGORY":
        return intl.formatMessage(messages.noCategorySet);
      case "INVALID":
        if (err.field === "price") {
          return intl.formatMessage(messages.priceInvalid);
        }

        return intl.formatMessage(commonErrorMessages.invalid);
      case "UNIQUE":
        if (err.field === "sku") {
          return intl.formatMessage(messages.skuUnique);
        }
    }
  }

  return getCommonFormFieldErrorMessage(err, intl);
}

export default getProductErrorMessage;
