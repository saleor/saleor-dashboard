import { type OrderDiscountType, type OrderLineFragment } from "@dashboard/graphql";

export interface LineDiscountSummaryEntry {
  type: OrderDiscountType;
  lineCount: number;
  totalAmount: number;
}

export type LineInput = Pick<OrderLineFragment, "discounts" | "unitDiscount" | "quantity">;

// Group line-level discounts by their type and sum their totals. We prefer
// the per-discount `total.amount` (ground truth from the backend) and fall
// back to `unitDiscount * quantity` only when `total` is missing on every
// discount of a line.
export function getLineDiscountsSummary(lines: LineInput[]): LineDiscountSummaryEntry[] {
  const grouped = new Map<OrderDiscountType, { lineCount: number; totalAmount: number }>();

  for (const line of lines) {
    if (!line.discounts?.length) {
      continue;
    }

    // Sum each discount's per-type contribution. The same line can have
    // multiple entries of the same type if the backend records them
    // separately (e.g. catalogue + manual).
    const perTypeTotals = new Map<OrderDiscountType, number>();
    let hasAnyTotal = false;

    for (const discount of line.discounts) {
      if (discount.total?.amount === undefined) continue;

      hasAnyTotal = true;
      perTypeTotals.set(
        discount.type,
        (perTypeTotals.get(discount.type) ?? 0) + discount.total.amount,
      );
    }

    if (!hasAnyTotal) {
      // Backend omitted `total` on the line discounts; fall back to the
      // legacy line-level `unitDiscount * quantity` heuristic so older API
      // versions keep producing a sensible summary.
      const fallback = line.unitDiscount.amount * line.quantity;

      if (fallback === 0) continue;

      perTypeTotals.set(line.discounts[0].type, fallback);
    }

    for (const [type, total] of perTypeTotals.entries()) {
      if (total === 0) continue;

      const existing = grouped.get(type);

      if (existing) {
        existing.lineCount += 1;
        existing.totalAmount += total;
      } else {
        grouped.set(type, { lineCount: 1, totalAmount: total });
      }
    }
  }

  return Array.from(grouped.entries()).map(([type, data]) => ({
    type,
    ...data,
  }));
}
