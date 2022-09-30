import currency from "currency.js";

import { ReducerOrderLine } from "./reducer";

export const calculateTotalPrice = (lines: ReducerOrderLine[]): number => {
  const amount = lines.reduce((total, line) => {
    const price = currency(line.unitPrice).multiply(line.selectedQuantity);
    return total.add(price.value);
  }, currency(0));

  return amount.value;
};
