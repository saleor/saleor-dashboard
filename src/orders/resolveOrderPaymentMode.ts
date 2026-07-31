import { MarkAsPaidStrategyEnum, type OrderDetailsFragment } from "@dashboard/graphql";

/**
 * Discriminated result of resolving which payment API a non-draft order uses.
 * Resolve once at the route seam; concrete views must not re-resolve.
 */
export type ResolvedOrder =
  | { kind: "legacy-payments"; order: OrderDetailsFragment }
  | { kind: "transactions"; order: OrderDetailsFragment };

/**
 * Transaction-wins precedence: an order that has transactions uses the
 * Transactions API, one that has only legacy payments uses the Payments API,
 * and one with no payment history follows its channel's mark-as-paid strategy.
 *
 * This is the only place that classifies an order's payment mode. Nothing
 * below a route seam may re-derive it from payments, transactions or the
 * channel — take the resolved kind from the route instead.
 */
const shouldUseTransactions = (order: OrderDetailsFragment): boolean => {
  if (order?.transactions?.length > 0) {
    return true;
  }

  if (order?.payments?.length > 0) {
    return false;
  }

  return (
    order?.channel?.orderSettings?.markAsPaidStrategy === MarkAsPaidStrategyEnum.TRANSACTION_FLOW
  );
};

export const resolveOrderPaymentMode = (order: OrderDetailsFragment): ResolvedOrder =>
  shouldUseTransactions(order)
    ? { kind: "transactions", order }
    : { kind: "legacy-payments", order };
