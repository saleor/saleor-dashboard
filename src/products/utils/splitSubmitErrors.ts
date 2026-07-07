import {
  type AttributeErrorFragment,
  type MetadataErrorFragment,
  type ProductChannelListingErrorFragment,
  type ProductErrorWithAttributesFragment,
  type UploadErrorFragment,
} from "@dashboard/graphql";
import getAttributeErrorMessage from "@dashboard/utils/errors/attribute";
import getProductErrorMessage from "@dashboard/utils/errors/product";
import { type IntlShape } from "react-intl";

export type ProductSubmitError =
  | ProductErrorWithAttributesFragment
  | ProductChannelListingErrorFragment;

type ProductSplittableSubmitError = {
  __typename?: string;
};

const isProductChannelListingError = (
  error: ProductSplittableSubmitError,
): error is ProductChannelListingErrorFragment => error.__typename === "ProductChannelListingError";

const isProductError = (
  error: ProductSplittableSubmitError,
): error is ProductErrorWithAttributesFragment => error.__typename === "ProductError";

const isAttributeError = (error: ProductSplittableSubmitError): error is AttributeErrorFragment =>
  error.__typename === "AttributeError";

const isUploadError = (error: ProductSplittableSubmitError): error is UploadErrorFragment =>
  error.__typename === "UploadError";

const isMetadataError = (error: ProductSplittableSubmitError): error is MetadataErrorFragment =>
  error.__typename === "MetadataError";

const isDatagridSubmitError = (error: ProductSplittableSubmitError): boolean =>
  error.__typename === "DatagridError";

const isInlineProductSubmitError = (error: ProductSplittableSubmitError): boolean =>
  isProductChannelListingError(error) || isDatagridSubmitError(error);

export const splitProductSubmitErrors = (
  errors: ProductSplittableSubmitError[],
): {
  productErrors: ProductErrorWithAttributesFragment[];
  channelsErrors: ProductChannelListingErrorFragment[];
} => {
  const productErrors: ProductErrorWithAttributesFragment[] = [];
  const channelsErrors: ProductChannelListingErrorFragment[] = [];

  errors.forEach(error => {
    if (isProductChannelListingError(error)) {
      channelsErrors.push(error);
    } else if (isProductError(error)) {
      productErrors.push(error);
    }
  });

  return { productErrors, channelsErrors };
};

const getNotificationMessageForSubmitError = (
  error: ProductSplittableSubmitError,
  intl: IntlShape,
): string | undefined => {
  if (isProductError(error) || isProductChannelListingError(error)) {
    return getProductErrorMessage(error, intl);
  }

  if (isAttributeError(error)) {
    return getAttributeErrorMessage(error, intl);
  }

  if (isUploadError(error) || isMetadataError(error)) {
    return error.message ?? undefined;
  }

  return undefined;
};

export const getProductSubmitErrorNotificationMessages = (
  errors: ProductSplittableSubmitError[],
  intl: IntlShape,
): string[] => {
  const messages = errors
    .filter(error => !isInlineProductSubmitError(error))
    .map(error => getNotificationMessageForSubmitError(error, intl))
    .filter((message): message is string => Boolean(message));

  return [...new Set(messages)];
};
