import { type DiscountErrorFragment } from "@dashboard/graphql";
import getDiscountErrorMessage from "@dashboard/utils/errors/discounts";
import { type IntlShape } from "react-intl";

const CATALOGUE_ERROR_FIELDS = new Set(["products", "categories", "collections", "variants"]);

export const isVoucherCatalogueError = (error: Pick<DiscountErrorFragment, "field">): boolean =>
  !!error.field && CATALOGUE_ERROR_FIELDS.has(error.field);

export const getVoucherCatalogueErrors = (
  errors: DiscountErrorFragment[],
): DiscountErrorFragment[] => errors.filter(isVoucherCatalogueError);

/** Human-readable catalogue-section message for products/categories/collections/variants errors. */
export const formatVoucherCatalogueErrorMessage = (
  errors: DiscountErrorFragment[],
  intl: IntlShape,
): string | undefined => {
  const catalogueErrors = getVoucherCatalogueErrors(errors);

  if (!catalogueErrors.length) {
    return undefined;
  }

  const primary = catalogueErrors[0];

  return getDiscountErrorMessage(primary, intl) || primary.message || undefined;
};
