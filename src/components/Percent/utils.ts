import { Locale } from "../Locale";

export const formatPercantage = (amount: number | undefined, locale: Locale) => {
  return amount
    ? (amount / 100).toLocaleString(locale, {
        maximumFractionDigits: 2,
        style: "percent",
      })
    : "-";
};
