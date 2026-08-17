import { z } from "zod";

/**
 * Dashboard "views" a SEARCH_ACTION extension can be scoped to. These mirror the
 * react-router page structure (list + detail pages per entity) and double as the
 * vocabulary for the `options.views` manifest field.
 *
 * Detail views resolve a single entity id as context (see resolveSearchActionContext);
 * list views are surfaced without an id in the current version.
 */
const VIEWS_ARRAY = [
  "PRODUCT_LIST",
  "PRODUCT_DETAILS",
  "ORDER_LIST",
  "ORDER_DETAILS",
  "DRAFT_ORDER_LIST",
  "DRAFT_ORDER_DETAILS",
  "CUSTOMER_LIST",
  "CUSTOMER_DETAILS",
  "COLLECTION_LIST",
  "COLLECTION_DETAILS",
  "CATEGORY_LIST",
  "CATEGORY_DETAILS",
  "GIFT_CARD_LIST",
  "GIFT_CARD_DETAILS",
  "VOUCHER_LIST",
  "VOUCHER_DETAILS",
  "DISCOUNT_LIST",
  "DISCOUNT_DETAILS",
  "PAGE_LIST",
  "PAGE_DETAILS",
  "PAGE_TYPE_LIST",
  "PAGE_TYPE_DETAILS",
  "MENU_LIST",
  "MENU_DETAILS",
] as const;

export const AppExtensionViews = z.enum(VIEWS_ARRAY);

export type AppExtensionView = z.infer<typeof AppExtensionViews>;
