import { type DiscountErrorFragment } from "@dashboard/graphql";
import getDiscountErrorMessage from "@dashboard/utils/errors/discounts";
import { type IntlShape } from "react-intl";

const CODES_ERROR_FIELDS = new Set(["codes", "code"]);

export const isVoucherCodesError = (error: Pick<DiscountErrorFragment, "field">): boolean =>
  !!error.field && CODES_ERROR_FIELDS.has(error.field);

export const getVoucherCodesErrors = (errors: DiscountErrorFragment[]): DiscountErrorFragment[] =>
  errors.filter(isVoucherCodesError);

/** Human-readable codes-section message, including conflicting codes when the API returns them. */
export const formatVoucherCodesErrorMessage = (
  errors: DiscountErrorFragment[],
  intl: IntlShape,
): string | undefined => {
  const codesErrors = getVoucherCodesErrors(errors);

  if (!codesErrors.length) {
    return undefined;
  }

  const primary = codesErrors[0];
  const base = getDiscountErrorMessage(primary, intl) || primary.message || undefined;
  const conflictingCodes = [
    ...new Set(codesErrors.flatMap(error => error.voucherCodes ?? []).filter(Boolean)),
  ];

  if (!base) {
    return conflictingCodes.length ? conflictingCodes.join(", ") : undefined;
  }

  if (!conflictingCodes.length) {
    return base;
  }

  return `${base}: ${conflictingCodes.join(", ")}`;
};
