import { IMoney } from "@dashboard/utils/intl";

export { default } from "./Money";
export * from "./Money";

export function addMoney(init: IMoney, ...args: IMoney[]): IMoney {
  return {
    amount: args.reduce((acc, curr) => acc + curr.amount, init.amount),
    currency: init.currency,
  };
}
export function subtractMoney(init: IMoney, ...args: IMoney[]): IMoney {
  return {
    amount: args.reduce((acc, curr) => acc - curr.amount, init.amount),
    currency: init.currency,
  };
}

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
