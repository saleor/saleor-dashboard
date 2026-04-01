import { type OrderDiscountType, type OrderLineFragment } from "@dashboard/graphql";

export interface LineDiscountSummaryEntry {
  type: OrderDiscountType;
  lineCount: number;
  totalAmount: number;
}

export type LineInput = Pick<OrderLineFragment, "discounts" | "unitDiscount" | "quantity">;

export function getLineDiscountsSummary(lines: LineInput[]): LineDiscountSummaryEntry[] {
  const grouped = new Map<OrderDiscountType, { lineCount: number; totalAmount: number }>();

  for (const line of lines) {
    if (!line.discounts?.length) {
      continue;
    }

    const discountAmount = line.unitDiscount.amount * line.quantity;

    if (discountAmount === 0) {
      continue;
    }

    // Each line has at most one active discount type; use the first entry to classify it.
    const type = line.discounts[0].type;
    const existing = grouped.get(type);

    if (existing) {
      existing.lineCount += 1;
      existing.totalAmount += discountAmount;
    } else {
      grouped.set(type, {
        lineCount: 1,
        totalAmount: discountAmount,
      });
    }
  }

  return Array.from(grouped.entries()).map(([type, data]) => ({
    type,
    ...data,
  }));
}
