const FALLBACK_MAX_FRACTION_DIGITS = 2;

/**
 * Formats percent input (e.g., tax rates).
 * Simpler than price input - no thousand separator handling needed.
 *
 * @param value - Raw input value
 * @param maxDecimalPlaces - Maximum decimal places (default: 3 for tax precision)
 * @returns Normalized percent string with dot decimal separator
 */
export const formatPercentInput = (value: string, maxDecimalPlaces = 3): string => {
  // Filter to only digits and one decimal separator
  const filtered = value.replace(/[^\d.,]/g, "");

  if (!filtered) {
    return "";
  }

  // Normalize comma to dot, keep only first separator
  const withDot = filtered.replace(/,/g, ".");
  const firstDotIndex = withDot.indexOf(".");

  if (firstDotIndex === -1) {
    return withDot;
  }

  const integerPart = withDot.slice(0, firstDotIndex);
  const decimalPart = withDot.slice(firstDotIndex + 1).replace(/\./g, "");

  if (!decimalPart) {
    return `${integerPart}.`;
  }

  return `${integerPart}.${decimalPart.slice(0, maxDecimalPlaces)}`;
};

/**
 * Gets the number of decimal places for a currency using Intl API.
 * Examples: USD → 2, JPY → 0, KWD → 3
 */
export const getCurrencyDecimalPoints = (currency?: string): number => {
  try {
    return (
      new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency: currency || "USD",
      }).resolvedOptions().maximumFractionDigits ?? FALLBACK_MAX_FRACTION_DIGITS
    );
  } catch {
    return FALLBACK_MAX_FRACTION_DIGITS;
  }
};

// Max digits to prevent overflow issues with float64 precision
const MAX_INTEGER_DIGITS = 15;

/**
 * Formats price input for controlled input fields.
 *
 * Handles two scenarios:
 * 1. **Typing** (same separator type): First separator wins, rest are accidents
 *    - "10.5.6" → "10.56" (double-tap accident)
 * 2. **Paste** (mixed separators): Smart detection of thousands format
 *    - "1,234.56" → "1234.56" (US format)
 *    - "1.234,56" → "1234.56" (EU format)
 *
 * @param value - Raw input value
 * @param maxDecimalPlaces - Maximum decimal places allowed (e.g., 2 for USD, 0 for JPY)
 * @returns Normalized price string with dot decimal separator
 */
export const formatPriceInput = (value: string, maxDecimalPlaces: number): string => {
  // Filter to only allow digits and decimal separators
  const filtered = value.replace(/[^\d.,]/g, "");

  if (!filtered) {
    return "";
  }

  // Just separators with no digits = empty
  if (!/\d/.test(filtered)) {
    return "";
  }

  const commaCount = (filtered.match(/,/g) || []).length;
  const dotCount = (filtered.match(/\./g) || []).length;
  const hasComma = commaCount > 0;
  const hasDot = dotCount > 0;

  let integerPart: string;
  let decimalPart: string | undefined;

  // Mixed separators = pasted formatted number (smart detection)
  // Valid formats have ONE type as decimal (last position) and other type as thousands
  // - US: "1,234.56" or "1,234,567.89" (dot is last, commas before)
  // - EU: "1.234,56" or "1.234.567,89" (comma is last, dots before)
  const lastComma = filtered.lastIndexOf(",");
  const lastDot = filtered.lastIndexOf(".");
  const lastSeparatorIndex = Math.max(lastComma, lastDot);
  const afterLastSeparator = filtered.slice(lastSeparatorIndex + 1);

  // Clean format: after the last separator, only digits (no more separators)
  const isCleanMixedFormat =
    hasComma &&
    hasDot &&
    /^\d*$/.test(afterLastSeparator) && // Only digits after last separator
    ((dotCount === 1 && lastDot > lastComma) || // US: one dot at end
      (commaCount === 1 && lastComma > lastDot)); // EU: one comma at end

  if (isCleanMixedFormat) {
    // Clean mixed format - detect US vs EU by last separator

    if (lastComma > lastDot) {
      // EU format: "1.234,56" or "1.234.567,89" → comma is decimal
      integerPart = filtered.slice(0, lastComma).replace(/\./g, "");
      decimalPart = filtered.slice(lastComma + 1);
    } else {
      // US format: "1,234.56" or "1,234,567.89" → dot is decimal
      integerPart = filtered.slice(0, lastDot).replace(/,/g, "");
      decimalPart = filtered.slice(lastDot + 1);
    }
  } else {
    // Same separator type = typing, first separator wins
    const withDots = filtered.replace(/,/g, ".");
    const firstDotIndex = withDots.indexOf(".");

    if (firstDotIndex === -1) {
      integerPart = withDots;
      decimalPart = undefined;
    } else {
      integerPart = withDots.slice(0, firstDotIndex);
      // Remove any extra dots from decimal part
      decimalPart = withDots.slice(firstDotIndex + 1).replace(/\./g, "");
    }
  }

  // Add leading zero for ".50" → "0.50"
  if (!integerPart && decimalPart !== undefined) {
    integerPart = "0";
  }

  // Limit integer part to prevent float64 precision issues
  if (integerPart.length > MAX_INTEGER_DIGITS) {
    integerPart = integerPart.slice(0, MAX_INTEGER_DIGITS);
  }

  // No decimal - return integer
  if (decimalPart === undefined) {
    return integerPart;
  }

  // Currency doesn't support decimals (e.g., JPY)
  if (maxDecimalPlaces === 0) {
    return integerPart;
  }

  // Truncate and format
  const truncated = decimalPart.slice(0, maxDecimalPlaces);

  return `${integerPart}.${truncated}`;
};
