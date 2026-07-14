/** Number of placed orders used for recent net sales and AOV (excludes draft and cancelled). */
export const RECENT_ORDERS_WINDOW = 10;

/**
 * Orders fetched for KPI computation and channel discovery.
 * Must match `orders(first: …)` in `src/customers/queries.ts` (`kpiOrders`, `kpiOrderChannels`).
 */
export const RECENT_ORDERS_FETCH_SIZE = 50;
