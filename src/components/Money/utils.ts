import { IMoney } from "@dashboard/utils/intl";

import { Locale } from "../Locale";

export const getMoney = (money: IMoney, locale: Locale) => {
  try {
    const currencyFractionDigits = new Intl.NumberFormat(locale, {
      style: "currency",
      currency: money.currency,
    }).resolvedOptions().maximumFractionDigits;

    return money.amount.toLocaleString(locale, {
      maximumFractionDigits: currencyFractionDigits,
      minimumFractionDigits: currencyFractionDigits,
    });
  } catch (e) {
    return money.amount.toLocaleString(locale);
  }
};
