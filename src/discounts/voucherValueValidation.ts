import { voucherFeedbackMessages } from "@dashboard/discounts/voucherFeedbackMessages";
import { commonMessages } from "@dashboard/intl";
import { type IntlShape } from "react-intl";

import { hasMoreDecimalPlacesThan } from "./decimalPlaces";
import { DiscountTypeEnum } from "./types";

/** Saleor stores voucher discount values with 3 decimal places and rounds anything finer. */
const VOUCHER_VALUE_DECIMAL_PLACES = 3;

export type DiscountValueIssue =
  | "required"
  | "notPositive"
  | "aboveHundredPercent"
  | "tooManyDecimals";

type WholeNumberIssue = "required" | "notWhole" | "belowOne" | "tooLarge";

export type MinSpentIssue = "required" | "negative";

/** Usage limits and quantities are GraphQL `Int`s, which are 32-bit. */
const MAX_GRAPHQL_INT = 2_147_483_647;

const toTrimmedText = (value: string | number | null | undefined): string =>
  value === null || value === undefined ? "" : String(value).trim();

/**
 * What is wrong with a channel's discount value, if anything. The API only rejects a percentage
 * above 100 against the voucher's saved type, and silently rounds values finer than 3 decimals
 * (0.000001% is stored as 0%), so these are checked before anything is sent.
 */
export const getDiscountValueIssue = (
  value: string | number | null | undefined,
  discountType: DiscountTypeEnum,
): DiscountValueIssue | null => {
  const text = toTrimmedText(value);
  const amount = Number(text);

  if (text === "" || !Number.isFinite(amount)) {
    return "required";
  }

  if (amount <= 0) {
    return "notPositive";
  }

  if (discountType === DiscountTypeEnum.VALUE_PERCENTAGE) {
    if (amount > 100) {
      return "aboveHundredPercent";
    }

    if (hasMoreDecimalPlacesThan(amount, VOUCHER_VALUE_DECIMAL_PLACES)) {
      return "tooManyDecimals";
    }
  }

  return null;
};

/**
 * What is wrong with a usage limit or minimum quantity, if anything. The API truncates fractions
 * without an error (1.5 is stored as 1), so a fraction is rejected here.
 */
export const getWholeNumberIssue = (
  value: string | number | null | undefined,
): WholeNumberIssue | null => {
  const text = toTrimmedText(value);
  const amount = Number(text);

  if (text === "" || !Number.isFinite(amount)) {
    return "required";
  }

  if (!Number.isInteger(amount)) {
    return "notWhole";
  }

  if (amount < 1) {
    return "belowOne";
  }

  if (amount > MAX_GRAPHQL_INT) {
    return "tooLarge";
  }

  return null;
};

/** What is wrong with a channel's minimum order value, if anything. 0 means no minimum. */
export const getMinSpentIssue = (
  value: string | number | null | undefined,
): MinSpentIssue | null => {
  const text = toTrimmedText(value);
  const amount = Number(text);

  if (text === "" || !Number.isFinite(amount)) {
    return "required";
  }

  return amount < 0 ? "negative" : null;
};

export const getMinSpentIssueMessage = (issue: MinSpentIssue, intl: IntlShape): string =>
  issue === "required"
    ? intl.formatMessage(commonMessages.requiredField)
    : intl.formatMessage(voucherFeedbackMessages.minSpentNegative);

export const getDiscountValueIssueMessage = (
  issue: DiscountValueIssue,
  intl: IntlShape,
): string => {
  switch (issue) {
    case "required":
      return intl.formatMessage(commonMessages.requiredField);
    case "notPositive":
      return intl.formatMessage(voucherFeedbackMessages.discountValueNotPositive);
    case "aboveHundredPercent":
      return intl.formatMessage(voucherFeedbackMessages.discountValueAboveHundredPercent);
    case "tooManyDecimals":
      return intl.formatMessage(voucherFeedbackMessages.discountValueTooManyDecimals);
  }
};

export const getWholeNumberIssueMessage = (
  issue: WholeNumberIssue,
  field: "usageLimit" | "minCheckoutItemsQuantity",
  intl: IntlShape,
): string => {
  switch (issue) {
    case "required":
      return intl.formatMessage(commonMessages.requiredField);
    case "notWhole":
      return intl.formatMessage(voucherFeedbackMessages.wholeNumber);
    case "belowOne":
      return intl.formatMessage(
        field === "usageLimit"
          ? voucherFeedbackMessages.usageLimitMin
          : voucherFeedbackMessages.minQuantityMin,
      );
    case "tooLarge":
      return intl.formatMessage(voucherFeedbackMessages.numberTooLarge, {
        max: intl.formatNumber(MAX_GRAPHQL_INT),
      });
  }
};
