import { IMoney } from "./Money";

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

export const formatMoneyRange = (
  moneyFrom: IMoney,
  moneyTo: IMoney,
  locale: string,
) => {
  try {
    const formattedMoneyRange = (Intl.NumberFormat(locale, {
      style: "currency",
      currency: moneyFrom.currency,
    }) as any).formatRange(moneyFrom.amount, moneyTo.amount);
    // TODO: remove casting from formatRange when typescript
    // is updated to 4.7 or higher
    return formattedMoneyRange;
  } catch (error) {
    const formattedMoneyFrom = formatMoney(moneyFrom, locale);
    const formattedMoneyTo = formatMoney(moneyTo, locale);
    return `${formattedMoneyFrom} - ${formattedMoneyTo}`;
  }
};
