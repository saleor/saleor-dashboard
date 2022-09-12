import { Locale } from "@saleor/components/Locale";

export interface IMoney {
  amount: number;
  currency: string;
}

export const getMoneyFormatted = (locale: Locale, money: IMoney) => {
  const currencyFractionDigits = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: money.currency,
  }).resolvedOptions().maximumFractionDigits;

  return money.amount.toLocaleString(locale, {
    maximumFractionDigits: currencyFractionDigits,
    minimumFractionDigits: currencyFractionDigits,
  });
};
