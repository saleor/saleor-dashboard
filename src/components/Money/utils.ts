import { Locale } from "../Locale";
import { IMoney } from "./Money";

export const getMoney = (money: IMoney, locale: Locale) => {
  const currencyFractionDigits = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: money.currency,
  }).resolvedOptions().maximumFractionDigits;

  return money.amount.toLocaleString(locale, {
    maximumFractionDigits: currencyFractionDigits,
    minimumFractionDigits: currencyFractionDigits,
  });
};
