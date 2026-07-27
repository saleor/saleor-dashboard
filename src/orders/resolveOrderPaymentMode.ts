import { type OrderDetailsFragment } from "@dashboard/graphql";

import { orderShouldUseTransactions } from "./types";

/**
 * Discriminated result of resolving which payment API a non-draft order uses.
 * Resolve once at the route seam; concrete views must not re-resolve.
 */
export type ResolvedOrder =
  | { kind: "legacy-payments"; order: OrderDetailsFragment }
  | { kind: "transactions"; order: OrderDetailsFragment };

/**
 * Transaction-wins precedence (transactions -> payments -> channel strategy),
 * delegated to the canonical classifier so precedence lives in one place.
 */
export const resolveOrderPaymentMode = (order: OrderDetailsFragment): ResolvedOrder =>
  orderShouldUseTransactions(order)
    ? { kind: "transactions", order }
    : { kind: "legacy-payments", order };
