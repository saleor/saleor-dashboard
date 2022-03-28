import { SEPARATOR_CHARACTERS } from "./consts";

export const getCurrencyDecimalPoints = (currency: string) => {
  const options = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency
  }).resolvedOptions();
  return options.maximumFractionDigits;
};

export const findPriceSeparator = (input: string) =>
  SEPARATOR_CHARACTERS.find(separator => input.includes(separator));
