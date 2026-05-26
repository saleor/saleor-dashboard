import { type IMoney } from "@dashboard/utils/intl";

export interface RecentCurrencyBucket {
  currency: string;
  count: number;
  spent: IMoney;
  aov: IMoney;
}

/**
 * Minimal input shape required by {@link groupRecentOrdersByCurrency}. Keeping
 * this decoupled from the generated GraphQL types makes the helper trivially
 * testable in isolation and shields it from future schema churn.
 */
export interface RecentOrderForBucketing {
  total: {
    gross: {
      amount: number;
      currency: string;
    };
  };
}

/**
 * Groups recent orders by their gross-total currency and computes the
 * per-currency `spent` (sum) and `aov` (mean) money values.
 *
 * Buckets are returned sorted by `count` descending (i.e. the customer's
 * dominant currency comes first), with currency code as a stable alphabetical
 * tie-breaker so the rendered order does not flicker between renders.
 */
export const groupRecentOrdersByCurrency = (
  orders: ReadonlyArray<RecentOrderForBucketing>,
): RecentCurrencyBucket[] => {
  if (orders.length === 0) {
    return [];
  }

  const amountsByCurrency = new Map<string, number[]>();

  for (const order of orders) {
    const { amount, currency } = order.total.gross;
    const existing = amountsByCurrency.get(currency) ?? [];

    existing.push(amount);
    amountsByCurrency.set(currency, existing);
  }

  return Array.from(amountsByCurrency.entries())
    .map(([currency, amounts]) => {
      const total = amounts.reduce((sum, amount) => sum + amount, 0);

      return {
        currency,
        count: amounts.length,
        spent: { amount: total, currency },
        aov: { amount: total / amounts.length, currency },
      };
    })
    .sort((a, b) => b.count - a.count || a.currency.localeCompare(b.currency));
};
