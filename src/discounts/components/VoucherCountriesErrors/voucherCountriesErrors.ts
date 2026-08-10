import { type DiscountErrorFragment } from "@dashboard/graphql";
import getDiscountErrorMessage from "@dashboard/utils/errors/discounts";
import { type IntlShape } from "react-intl";

export const isVoucherCountriesError = (error: Pick<DiscountErrorFragment, "field">): boolean =>
  error.field === "countries";

export const getVoucherCountriesErrors = (
  errors: DiscountErrorFragment[],
): DiscountErrorFragment[] => errors.filter(isVoucherCountriesError);

/** Human-readable countries-section message for free-shipping country assign errors. */
export const formatVoucherCountriesErrorMessage = (
  errors: DiscountErrorFragment[],
  intl: IntlShape,
): string | undefined => {
  const countriesErrors = getVoucherCountriesErrors(errors);

  if (!countriesErrors.length) {
    return undefined;
  }

  const primary = countriesErrors[0];

  return getDiscountErrorMessage(primary, intl) || primary.message || undefined;
};
