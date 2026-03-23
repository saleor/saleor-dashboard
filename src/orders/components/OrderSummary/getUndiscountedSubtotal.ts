import { type OrderLineFragment } from "@dashboard/graphql";

type LineInput = Pick<OrderLineFragment, "undiscountedUnitPrice" | "quantity">;

export function getUndiscountedSubtotal(lines: LineInput[], displayGrossPrices: boolean): number {
  return lines.reduce((sum, line) => {
    const price = displayGrossPrices
      ? line.undiscountedUnitPrice.gross.amount
      : line.undiscountedUnitPrice.net.amount;

    return sum + price * line.quantity;
  }, 0);
}
