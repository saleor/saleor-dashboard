import { SEPARATOR_CHARACTERS } from "./consts";

const FALLBACK_MAX_FRACTION_DIGITS = 2;

const resolveDigitsFromCurrencyOrFallback = (currency = "USD"): number => {
  try {
    return (
      new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency,
      }).resolvedOptions().maximumFractionDigits ?? FALLBACK_MAX_FRACTION_DIGITS
    );
  } catch (e) {
    try {
      // fallback to "USD" if currency wasn't recognised
      return (
        new Intl.NumberFormat("en-GB", {
          style: "currency",
          currency: "USD",
        }).resolvedOptions().maximumFractionDigits ?? FALLBACK_MAX_FRACTION_DIGITS
      );
    } catch {
      // everything is broken - try to return something that makes sense
      return FALLBACK_MAX_FRACTION_DIGITS;
    }
  }
};

export const getCurrencyDecimalPoints = (currency?: string) => {
  return resolveDigitsFromCurrencyOrFallback(currency);
};

export const findPriceSeparator = (input: string) =>
  SEPARATOR_CHARACTERS.find(separator => input.includes(separator));

/**
 * Normalizes decimal separator to JavaScript standard (dot).
 * Converts comma to dot for locales that use comma as decimal separator.
 */
export const normalizeDecimalSeparator = (value: string): string => value.replace(",", ".");

/**
 * Parses a decimal string value to a number, handling locale-specific separators.
 * Returns 0 if the value cannot be parsed.
 */
export const parseDecimalValue = (value: string): number =>
  parseFloat(normalizeDecimalSeparator(value)) || 0;

/**
 * Limits decimal places in a string value, preserving the user's original separator.
 * Useful for input validation while typing.
 */
export const limitDecimalPlaces = (value: string, maxDecimalPlaces: number): string => {
  const normalized = normalizeDecimalSeparator(value);
  const separator = value.includes(",") ? "," : ".";
  const [integerPart, decimalPart] = normalized.split(".");

  if (!decimalPart) {
    return value;
  }

  if (maxDecimalPlaces === 0) {
    return integerPart;
  }

  if (decimalPart.length > maxDecimalPlaces) {
    return `${integerPart}${separator}${decimalPart.slice(0, maxDecimalPlaces)}`;
  }

  return value;
};
