import { matchPath } from "react-router";

import { type AppExtensionView } from "../domain/app-extension-manifest-views";
import { type AppDetailsUrlMountQueryParams } from "../urls";

export interface SearchActionContext {
  /** The dashboard view the user is currently on, or null on non-entity routes. */
  view: AppExtensionView | null;
  /** Entity id context for the current view (empty on list / non-entity routes). */
  params: AppDetailsUrlMountQueryParams;
}

interface ViewMatcher {
  view: AppExtensionView;
  path: string;
  /** Present for detail views — the query param the captured id maps to. */
  param?: keyof AppDetailsUrlMountQueryParams;
  /** List views match exactly; detail views match loosely so nested routes collapse to the parent. */
  exact?: boolean;
}

/**
 * URL path segments that look like an entity id but are actually create pages or
 * sub-sections. When a detail matcher captures one of these we skip it, letting the
 * route fall through to its list view or to "no view".
 */
const RESERVED_IDS = new Set(["add", "settings", "drafts", "sales", "vouchers"]);

/**
 * Ordered most-specific-first. Detail matchers precede their list matchers, and
 * nested sections (draft orders) precede their parent (orders).
 */
const MATCHERS: ViewMatcher[] = [
  { view: "DRAFT_ORDER_DETAILS", path: "/orders/drafts/:id", param: "draftOrderId" },
  { view: "DRAFT_ORDER_LIST", path: "/orders/drafts", exact: true },
  { view: "ORDER_DETAILS", path: "/orders/:id", param: "orderId" },
  { view: "ORDER_LIST", path: "/orders", exact: true },
  { view: "PRODUCT_DETAILS", path: "/products/:id", param: "productId" },
  { view: "PRODUCT_LIST", path: "/products", exact: true },
  { view: "CUSTOMER_DETAILS", path: "/customers/:id", param: "customerId" },
  { view: "CUSTOMER_LIST", path: "/customers", exact: true },
  { view: "COLLECTION_DETAILS", path: "/collections/:id", param: "collectionId" },
  { view: "COLLECTION_LIST", path: "/collections", exact: true },
  { view: "CATEGORY_DETAILS", path: "/categories/:id", param: "categoryId" },
  { view: "CATEGORY_LIST", path: "/categories", exact: true },
  { view: "GIFT_CARD_DETAILS", path: "/gift-cards/:id", param: "giftCardId" },
  { view: "GIFT_CARD_LIST", path: "/gift-cards", exact: true },
  { view: "VOUCHER_DETAILS", path: "/discounts/vouchers/:id", param: "voucherId" },
  { view: "VOUCHER_LIST", path: "/discounts/vouchers", exact: true },
  { view: "DISCOUNT_DETAILS", path: "/discounts/sales/:id", param: "discountId" },
  { view: "DISCOUNT_LIST", path: "/discounts/sales", exact: true },
  { view: "PAGE_DETAILS", path: "/models/:id", param: "pageId" },
  { view: "PAGE_LIST", path: "/models", exact: true },
  { view: "PAGE_TYPE_DETAILS", path: "/model-types/:id", param: "pageTypeId" },
  { view: "PAGE_TYPE_LIST", path: "/model-types", exact: true },
  { view: "MENU_DETAILS", path: "/structures/:id", param: "menuId" },
  { view: "MENU_LIST", path: "/structures", exact: true },
];

const EMPTY_CONTEXT: SearchActionContext = { view: null, params: {} };

/**
 * Derives the current dashboard view and its entity-id context from a pathname.
 *
 * Detail routes resolve a single id (nested routes such as a product variant or an
 * order fulfilment collapse to the parent entity). List routes resolve a view with no
 * id. Non-entity routes (home, settings, configuration) resolve to no view — only
 * "everywhere" actions apply there.
 */
export const resolveSearchActionContext = (pathname: string): SearchActionContext => {
  for (const matcher of MATCHERS) {
    const match = matchPath<{ id?: string }>(pathname, {
      path: matcher.path,
      exact: matcher.exact ?? false,
    });

    if (!match) {
      continue;
    }

    if (matcher.param) {
      const id = match.params.id;

      if (!id || RESERVED_IDS.has(id)) {
        continue;
      }

      return { view: matcher.view, params: { [matcher.param]: id } };
    }

    return { view: matcher.view, params: {} };
  }

  return EMPTY_CONTEXT;
};
