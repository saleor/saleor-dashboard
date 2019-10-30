import { IMoney } from "./Money";

export { default } from "./Money";
export * from "./Money";

export function addMoney(init: IMoney, ...args: IMoney[]): IMoney {
  return {
    amount: args.reduce((acc, curr) => acc + curr.amount, init.amount),
    currency: init.currency
  };
}
export function subtractMoney(init: IMoney, ...args: IMoney[]): IMoney {
  return {
    amount: args.reduce((acc, curr) => acc - curr.amount, init.amount),
    currency: init.currency
  };
}
