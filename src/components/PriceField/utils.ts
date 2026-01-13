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
 * Handles different locale formats:
 * - European: "1.234,56" → "1234.56" (comma decimal, dot thousand)
 * - US: "1,234.56" → "1234.56" (dot decimal, comma thousand)
 * - Simple: "10,50" or "10.50" → "10.50"
 * - US thousands only: "1,234,567" → "1234567"
 * - European thousands only: "1.234.567" → "1234567"
 */
export const normalizeDecimalSeparator = (value: string): string => {
  const commaCount = (value.match(/,/g) || []).length;
  const dotCount = (value.match(/\./g) || []).length;

  if (commaCount > 0 && dotCount > 0) {
    // Both separators present - last one is decimal, other is thousand
    const lastComma = value.lastIndexOf(",");
    const lastDot = value.lastIndexOf(".");

    if (lastComma > lastDot) {
      // European format: 1.234,56 → remove dots, convert comma to dot
      return value.replace(/\./g, "").replace(",", ".");
    } else {
      // US format: 1,234.56 → remove commas
      return value.replace(/,/g, "");
    }
  }

  // Multiple commas = US thousands separators (e.g., "1,234,567")
  if (commaCount > 1) {
    return value.replace(/,/g, "");
  }

  // Multiple dots = European thousands separators (e.g., "1.234.567")
  if (dotCount > 1) {
    return value.replace(/\./g, "");
  }

  // Single comma (European decimal) or single dot (US decimal) or no separator
  return value.replace(",", ".");
};

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
