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

const MAX_INTEGER_DIGITS = 15;
const CHAR_CODE_0 = 48;
const CHAR_CODE_9 = 57;
const CHAR_CODE_COMMA = 44;
const CHAR_CODE_DOT = 46;

const limitInteger = (value: string): string => {
  const v =
    value.charCodeAt(0) === CHAR_CODE_0 && value.length > 1
      ? value.replace(/^0+(\d)/, "$1")
      : value;

  return v.length > MAX_INTEGER_DIGITS ? v.slice(0, MAX_INTEGER_DIGITS) : v;
};

/**
 * Returns true when a string contains only digits and at most one dot,
 * with at least one digit present. Covers ~99% of keystroke inputs
 * without touching the regex engine.
 */
const isSimpleDecimal = (s: string): boolean => {
  let dots = 0;
  let hasDigit = false;

  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i);

    if (c === CHAR_CODE_DOT) {
      if (++dots > 1) return false;
    } else if (c >= CHAR_CODE_0 && c <= CHAR_CODE_9) {
      hasDigit = true;
    } else {
      return false;
    }
  }

  return hasDigit;
};

/**
 * Validates thousand-separator groups with a single character pass.
 * First group: 1+ digits. All subsequent groups: exactly 3 digits.
 */
const isValidThousandGrouping = (raw: string, separator: string): boolean => {
  const sep = separator.charCodeAt(0);
  let groupLen = 0;
  let firstGroup = true;

  for (let i = 0; i < raw.length; i++) {
    const c = raw.charCodeAt(i);

    if (c === sep) {
      if (firstGroup) {
        if (groupLen === 0) return false;

        firstGroup = false;
      } else if (groupLen !== 3) {
        return false;
      }

      groupLen = 0;
    } else if (c >= CHAR_CODE_0 && c <= CHAR_CODE_9) {
      groupLen++;
    } else {
      return false;
    }
  }

  if (firstGroup) return true;

  return groupLen === 3;
};

/**
 * Common handler for dot-decimal input (typing mode).
 * First dot = decimal, extra dots collapsed.
 */
const formatDecimalInput = (filtered: string, maxDecimalPlaces: number): string => {
  const firstDotIndex = filtered.indexOf(".");

  if (firstDotIndex === -1) {
    return limitInteger(filtered);
  }

  let integerPart = filtered.slice(0, firstDotIndex);
  const afterDot = filtered.slice(firstDotIndex + 1);
  const rawDecimal = afterDot.indexOf(".") !== -1 ? afterDot.replace(/\./g, "") : afterDot;

  if (!integerPart) integerPart = "0";

  integerPart = limitInteger(integerPart);

  if (maxDecimalPlaces === 0) return integerPart;

  return `${integerPart}.${rawDecimal.slice(0, maxDecimalPlaces)}`;
};

/**
 * Mixed separators (both commas and dots) = pasted formatted number.
 * Detects US (1,234.56) vs EU (1.234,56) by last separator position.
 * Rejects ambiguous or malformed formats.
 */
const formatMixedSeparators = (
  filtered: string,
  commaCount: number,
  dotCount: number,
  maxDecimalPlaces: number,
): string => {
  const lastComma = filtered.lastIndexOf(",");
  const lastDot = filtered.lastIndexOf(".");
  const lastSeparatorIndex = Math.max(lastComma, lastDot);
  const afterLastSeparator = filtered.slice(lastSeparatorIndex + 1);

  const isClean =
    /^\d*$/.test(afterLastSeparator) &&
    ((dotCount === 1 && lastDot > lastComma) || (commaCount === 1 && lastComma > lastDot));

  if (!isClean) return "";

  let integerRaw: string;
  let decimalPart: string;

  if (lastComma > lastDot) {
    integerRaw = filtered.slice(0, lastComma);

    if (!isValidThousandGrouping(integerRaw, ".")) return "";

    integerRaw = integerRaw.replace(/\./g, "");
    decimalPart = filtered.slice(lastComma + 1);
  } else {
    integerRaw = filtered.slice(0, lastDot);

    if (!isValidThousandGrouping(integerRaw, ",")) return "";

    integerRaw = integerRaw.replace(/,/g, "");
    decimalPart = filtered.slice(lastDot + 1);
  }

  return formatDecimalInput(`${integerRaw}.${decimalPart}`, maxDecimalPlaces);
};

/**
 * Comma-only input. Distinguishes between:
 * - Thousand separators: "1,000" → "1000" (all groups exactly 3 digits)
 * - Typing mode: "10,50" → "10.50" (first comma = decimal)
 * Rejects malformed thousand-separator patterns (e.g. "1,234,567,89").
 */
const formatCommaOnly = (filtered: string, maxDecimalPlaces: number): string => {
  const parts = filtered.split(",");

  if (parts.length >= 2 && parts[0].length > 0) {
    let allThree = true;

    for (let i = 1; i < parts.length; i++) {
      if (parts[i].length !== 3) {
        allThree = false;
        break;
      }
    }

    if (allThree) return limitInteger(parts.join(""));
  }

  if (parts.length >= 3) {
    for (let i = 1; i < parts.length - 1; i++) {
      if (parts[i].length === 3) return "";
    }
  }

  return formatDecimalInput(filtered.replace(/,/g, "."), maxDecimalPlaces);
};

/**
 * Handles apostrophe thousand separators (Swiss format: 1'234'567.89).
 * Validates grouping, supports dot or comma as decimal separator.
 */
const formatApostrophePrice = (value: string, maxDecimalPlaces: number): string => {
  if (value.includes("''")) return "";

  const filtered = value.replace(/[^\d'.,]/g, "");

  if (!filtered || !/\d/.test(filtered)) return "";

  if (filtered.startsWith("'")) return "";

  const hasDot = filtered.includes(".");
  const hasComma = filtered.includes(",");

  if (hasDot && hasComma) return "";

  let integerWithApostrophes: string;
  let decimalSuffix: string;

  if (hasDot) {
    const idx = filtered.indexOf(".");

    integerWithApostrophes = filtered.slice(0, idx);
    decimalSuffix = filtered.slice(idx);
  } else if (hasComma) {
    const idx = filtered.indexOf(",");

    integerWithApostrophes = filtered.slice(0, idx);
    decimalSuffix = "." + filtered.slice(idx + 1);
  } else {
    integerWithApostrophes = filtered;
    decimalSuffix = "";
  }

  const groups = integerWithApostrophes.split("'");

  if (groups.some(g => g.length === 0)) return "";

  if (!/^\d+$/.test(groups[0])) return "";

  for (let i = 1; i < groups.length; i++) {
    if (groups[i].length !== 3) return "";
  }

  if (decimalSuffix.includes("'")) return "";

  if (decimalSuffix.indexOf(".") !== decimalSuffix.lastIndexOf(".")) return "";

  return formatDecimalInput(groups.join("") + decimalSuffix, maxDecimalPlaces);
};

/**
 * Formats price input for controlled input fields.
 *
 * Handles multiple scenarios:
 * 1. **Typing** (same separator type): First separator wins, rest are accidents
 *    - "10.5.6" → "10.56"
 * 2. **Paste with mixed separators**: Smart US/EU detection
 *    - "1,234.56" → "1234.56" (US), "1.234,56" → "1234.56" (EU)
 * 3. **Comma-only thousands**: "1,000" → "1000" (groups of 3 after comma)
 * 4. **Apostrophe thousands** (Swiss): "1'234.56" → "1234.56"
 *
 * @param value - Raw input value
 * @param maxDecimalPlaces - Maximum decimal places allowed (e.g., 2 for USD, 0 for JPY)
 * @returns Normalized price string with dot decimal separator, or "" for invalid input
 */
export const formatPriceInput = (value: string, maxDecimalPlaces: number): string => {
  // Collapse trailing adjacent separators (typing double-tap: "123.," → "123.")
  let v = value;

  if (v.length >= 2) {
    const last = v.charCodeAt(v.length - 1);
    const prev = v.charCodeAt(v.length - 2);

    if (
      (last === CHAR_CODE_COMMA || last === CHAR_CODE_DOT) &&
      (prev === CHAR_CODE_COMMA || prev === CHAR_CODE_DOT)
    ) {
      v = v.slice(0, -1);
    }
  }

  // Fast path: clean digit+dot input covers ~99% of typing keystrokes.
  // Single char-loop, zero regex, zero allocations.
  if (isSimpleDecimal(v)) {
    return formatDecimalInput(v, maxDecimalPlaces);
  }

  if (/\d\s\d/.test(v)) return "";

  if (v.includes("'")) {
    return formatApostrophePrice(v, maxDecimalPlaces);
  }

  const filtered = v.replace(/[^\d.,]/g, "");

  if (!filtered) return "";

  // Single-pass: count separators and check for digits
  let commaCount = 0;
  let dotCount = 0;
  let hasDigit = false;

  for (let i = 0; i < filtered.length; i++) {
    const c = filtered.charCodeAt(i);

    if (c === CHAR_CODE_COMMA) commaCount++;
    else if (c === CHAR_CODE_DOT) dotCount++;
    else hasDigit = true;
  }

  if (!hasDigit) return "";

  if (commaCount > 0 && dotCount > 0) {
    return formatMixedSeparators(filtered, commaCount, dotCount, maxDecimalPlaces);
  }

  if (commaCount > 0) {
    return formatCommaOnly(filtered, maxDecimalPlaces);
  }

  return formatDecimalInput(filtered, maxDecimalPlaces);
};
