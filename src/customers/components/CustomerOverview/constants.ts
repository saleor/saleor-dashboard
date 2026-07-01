/** Number of non-cancelled orders used for recent net sales and AOV. */
export const RECENT_ORDERS_WINDOW = 10;

/**
 * Orders fetched for KPI computation (`customerDetails` query `kpiOrders`).
 * Must match `orders(first: …)` in `src/customers/queries.ts`.
 */
export const RECENT_ORDERS_FETCH_SIZE = 50;
