import {
  type ProductChannelListingErrorFragment,
  type ProductErrorFragment,
} from "@dashboard/graphql";
import getProductErrorMessage from "@dashboard/utils/errors/product";
import { type IntlShape } from "react-intl";

export type ProductSubmitError = ProductErrorFragment | ProductChannelListingErrorFragment;

type SplittableSubmitError = {
  __typename?: string;
};

const isProductChannelListingError = (
  error: SplittableSubmitError,
): error is ProductChannelListingErrorFragment => error.__typename === "ProductChannelListingError";

const isInlineProductSubmitError = (error: SplittableSubmitError): boolean =>
  isProductChannelListingError(error) || error.__typename === "DatagridError";

export const splitProductSubmitErrors = <T extends SplittableSubmitError>(errors: T[]) => {
  const productErrors: T[] = [];
  const channelsErrors: ProductChannelListingErrorFragment[] = [];

  errors.forEach(error => {
    if (isProductChannelListingError(error)) {
      channelsErrors.push(error);
    } else if (!isInlineProductSubmitError(error)) {
      productErrors.push(error);
    }
  });

  return { productErrors, channelsErrors };
};

export const getProductSubmitErrorNotificationMessages = (
  errors: SplittableSubmitError[],
  intl: IntlShape,
): string[] => {
  const messages = errors
    .filter(error => !isInlineProductSubmitError(error))
    .map(error => getProductErrorMessage(error, intl))
    .filter((message): message is string => Boolean(message));

  return [...new Set(messages)];
};
