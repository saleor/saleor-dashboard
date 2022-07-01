import { SEPARATOR_CHARACTERS } from "./consts";

const getNumberFormatting = (currency: string = "USD") => {
  try {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency,
    });
  } catch (e) {
    try {
      // fallback to "USD" if currency wasn't recognised
      return new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency: "USD",
      });
    } catch {
      // everything is broken - try to return something that makes sense
      return {
        resolvedOptions: () => ({
          maximumFractionDigits: 2,
        }),
      };
    }
  }
};

export const getCurrencyDecimalPoints = (currency?: string) => {
  const options = getNumberFormatting(currency).resolvedOptions();
  return options.maximumFractionDigits;
};

export const findPriceSeparator = (input: string) =>
  SEPARATOR_CHARACTERS.find(separator => input.includes(separator));
