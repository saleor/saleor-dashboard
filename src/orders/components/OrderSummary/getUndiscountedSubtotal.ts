import { type OrderLineFragment } from "@dashboard/graphql";

type LineInput = Pick<OrderLineFragment, "undiscountedTotalPrice">;

/** Sums each line's `undiscountedTotalPrice` from the API (not unit × qty on the client). */
export function getUndiscountedSubtotal(lines: LineInput[], useGrossAmount: boolean): number {
  return lines.reduce((sum, line) => {
    const amount = useGrossAmount
      ? line.undiscountedTotalPrice.gross.amount
      : line.undiscountedTotalPrice.net.amount;

    return sum + amount;
  }, 0);
}
