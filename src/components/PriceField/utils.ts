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
