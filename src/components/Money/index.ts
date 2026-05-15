import { getCurrencyDecimalPoints } from "@dashboard/components/PriceField/utils";
import { type IMoney } from "@dashboard/utils/intl";

export { default } from "./Money";
export * from "./Money";
export function subtractMoney(init: IMoney, ...args: IMoney[]): IMoney {
  return {
    amount: args.reduce((acc, curr) => acc - curr.amount, init.amount),
    currency: init.currency,
  };
}

/**
 * Round a numerical amount to the given number of fraction digits. Prefer this
 * helper when the precision is available on the wire — Saleor returns
 * `Money.fractionDigits` (spread `MoneyWithFractionDigits` in your query), and
 * the backend's value is the source of truth for the currency's minor-unit
 * precision.
 *
 * For display use `formatMoneyAmount` / `formatMoney` instead.
 */
export const roundMoneyByDigits = (amount: number, fractionDigits: number): number => {
  const factor = 10 ** fractionDigits;

  return Math.round(amount * factor) / factor;
};

/**
 * Round a numerical amount to the minor-unit precision of its currency,
 * derived client-side via `Intl.NumberFormat`. USD/EUR → 2 decimals,
 * JPY/KRW → 0 decimals, BHD/KWD → 3 decimals. Falls back to 2 decimals when
 * the currency is unknown.
 *
 * Prefer `roundMoneyByDigits` when `Money.fractionDigits` is available on the
 * wire — the backend value is the authoritative source for currency precision
 * and avoids drift across browser CLDR versions.
 */
export const roundMoneyAmount = (amount: number, currency: string): number =>
  roundMoneyByDigits(amount, getCurrencyDecimalPoints(currency));

export const formatMoneyAmount = (money: IMoney, locale: string) => {
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

export const formatMoney = (money: IMoney, locale: string) => {
  try {
    const formattedMoney = Intl.NumberFormat(locale, {
      style: "currency",
      currency: money.currency,
    }).format(money.amount);

    return formattedMoney;
  } catch (error) {
    return `${money.amount} ${money.currency}`;
  }
};

export const formatMoneyRange = (moneyFrom: IMoney, moneyTo: IMoney, locale: string) => {
  try {
    const formattedMoneyRange = Intl.NumberFormat(locale, {
      style: "currency",
      currency: moneyFrom.currency,
    }).formatRange(moneyFrom.amount, moneyTo.amount);

    return formattedMoneyRange;
  } catch (error) {
    const formattedMoneyFrom = formatMoney(moneyFrom, locale);
    const formattedMoneyTo = formatMoney(moneyTo, locale);

    return `${formattedMoneyFrom} – ${formattedMoneyTo}`;
  }
};
