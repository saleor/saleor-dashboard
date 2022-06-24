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
    const formattedMoney = money.amount.toLocaleString(locale, {
      currency: money.currency,
      style: "currency",
    });
    return formattedMoney;
  } catch (error) {
    return `${money.amount} ${money.currency}`;
  }
};
