import { hookFactory } from "../helpers/hookFactory";

/**
 * React hook to get client's config methods
 *
 * @returns Saleor's client's config methods
 */
export const useSaleorConfig = hookFactory("config");
