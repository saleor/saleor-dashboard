import packageInfo from "../package.json";
import { SearchVariables } from "./hooks/makeSearch";
import { ListSettings, ListViews, Pagination } from "./types";

export const getAppDefaultUri = () => "/";
export const getAppMountUri = () =>
  window?.__SALEOR_CONFIG__?.APP_MOUNT_URI || getAppDefaultUri();
export const getApiUrl = () => window.__SALEOR_CONFIG__.API_URL;
export const SW_INTERVAL = parseInt(process.env.SW_INTERVAL ?? "300", 10);
export const IS_CLOUD_INSTANCE =
  window.__SALEOR_CONFIG__.IS_CLOUD_INSTANCE === "true";

export const getAppsConfig = () => ({
  marketplaceApiUri: window.__SALEOR_CONFIG__.APPS_MARKETPLACE_API_URI,
  tunnelUrlKeywords: window.__SALEOR_CONFIG__.APPS_TUNNEL_URL_KEYWORDS?.split(
    ";",
  ) || [".ngrok.io", ".saleor.live", ".trycloudflare.com"],
});

export const DEFAULT_INITIAL_SEARCH_DATA: SearchVariables = {
  after: null,
  first: 20,
  query: "",
};

export const DEFAULT_INITIAL_PAGINATION_DATA: Pagination = {
  after: undefined,
  before: undefined,
};

export const PAGINATE_BY = 20;
export const VALUES_PAGINATE_BY = 10;

export type ProductListColumns =
  | "name"
  | "productType"
  | "description"
  | "availability"
  | "price"
  | "date"
  | "productCategory"
  | "productCollections";

export interface AppListViewSettings {
  [ListViews.APPS_LIST]: ListSettings;
  [ListViews.ATTRIBUTE_VALUE_LIST]: ListSettings;
  [ListViews.ATTRIBUTE_LIST]: ListSettings;
  [ListViews.CATEGORY_LIST]: ListSettings;
  [ListViews.COLLECTION_LIST]: ListSettings;
  [ListViews.CUSTOMER_LIST]: ListSettings;
  [ListViews.DRAFT_LIST]: ListSettings;
  [ListViews.NAVIGATION_LIST]: ListSettings;
  [ListViews.ORDER_LIST]: ListSettings;
  [ListViews.PAGES_LIST]: ListSettings;
  [ListViews.PLUGINS_LIST]: ListSettings;
  [ListViews.PRODUCT_LIST]: ListSettings<ProductListColumns>;
  [ListViews.SALES_LIST]: ListSettings;
  [ListViews.DISCOUNTS_LIST]: ListSettings;
  [ListViews.SHIPPING_METHODS_LIST]: ListSettings;
  [ListViews.STAFF_MEMBERS_LIST]: ListSettings;
  [ListViews.PERMISSION_GROUP_LIST]: ListSettings;
  [ListViews.VOUCHER_LIST]: ListSettings;
  [ListViews.WAREHOUSE_LIST]: ListSettings;
  [ListViews.WEBHOOK_LIST]: ListSettings;
  [ListViews.TRANSLATION_ATTRIBUTE_VALUE_LIST]: ListSettings;
  [ListViews.GIFT_CARD_LIST]: ListSettings;
  [ListViews.ORDER_DETAILS_LIST]: ListSettings;
  [ListViews.ORDER_DRAFT_DETAILS_LIST]: ListSettings;
  [ListViews.PRODUCT_DETAILS]: ListSettings;
  [ListViews.VOUCHER_CODES]: ListSettings;
}

export const defaultListSettings: AppListViewSettings = {
  [ListViews.APPS_LIST]: {
    rowNumber: 100,
  },
  [ListViews.ATTRIBUTE_VALUE_LIST]: {
    rowNumber: 10,
  },
  [ListViews.ATTRIBUTE_LIST]: {
    rowNumber: 10,
    columns: ["slug", "name", "visible", "searchable", "use-in-faceted-search"],
  },
  [ListViews.CATEGORY_LIST]: {
    rowNumber: PAGINATE_BY,
    columns: ["name", "products", "subcategories"],
  },
  [ListViews.COLLECTION_LIST]: {
    rowNumber: PAGINATE_BY,
    columns: ["name", "productCount", "availability"],
  },
  [ListViews.CUSTOMER_LIST]: {
    rowNumber: PAGINATE_BY,
    columns: ["name", "email", "orders"],
  },
  [ListViews.DRAFT_LIST]: {
    rowNumber: PAGINATE_BY,
    columns: ["number", "date", "customer", "total"],
  },
  [ListViews.NAVIGATION_LIST]: {
    rowNumber: PAGINATE_BY,
  },
  [ListViews.ORDER_LIST]: {
    rowNumber: PAGINATE_BY,
    columns: ["number", "date", "customer", "payment", "status", "total"],
  },
  [ListViews.PAGES_LIST]: {
    rowNumber: PAGINATE_BY,
    columns: ["title", "slug", "visible"],
  },
  [ListViews.PLUGINS_LIST]: {
    rowNumber: PAGINATE_BY,
  },
  [ListViews.PRODUCT_LIST]: {
    columns: [
      "name",
      "availability",
      "description",
      "price",
      "productType",
      "date",
    ],
    rowNumber: PAGINATE_BY,
  },
  [ListViews.SALES_LIST]: {
    rowNumber: PAGINATE_BY,
    columns: ["name", "startDate", "endDate", "value"],
  },
  [ListViews.DISCOUNTS_LIST]: {
    rowNumber: PAGINATE_BY,
    columns: ["name", "type", "startDate", "endDate"],
  },
  [ListViews.SHIPPING_METHODS_LIST]: {
    columns: ["name", "countries"],
    rowNumber: PAGINATE_BY,
  },
  [ListViews.STAFF_MEMBERS_LIST]: {
    rowNumber: PAGINATE_BY,
    columns: ["name", "email", "status"],
  },
  [ListViews.PERMISSION_GROUP_LIST]: {
    rowNumber: PAGINATE_BY,
    columns: ["name", "members"],
  },
  [ListViews.VOUCHER_LIST]: {
    rowNumber: PAGINATE_BY,
    columns: ["code", "min-spent", "start-date", "end-date", "value", "limit"],
  },

  [ListViews.WAREHOUSE_LIST]: {
    rowNumber: PAGINATE_BY,
  },
  [ListViews.WEBHOOK_LIST]: {
    rowNumber: PAGINATE_BY,
  },
  [ListViews.TRANSLATION_ATTRIBUTE_VALUE_LIST]: {
    rowNumber: 10,
  },
  [ListViews.GIFT_CARD_LIST]: {
    rowNumber: PAGINATE_BY,
    columns: ["giftCardCode", "status", "tag", "product", "usedBy", "balance"],
  },
  [ListViews.ORDER_DETAILS_LIST]: {
    rowNumber: PAGINATE_BY,
    columns: [
      "product",
      "sku",
      "variantName",
      "quantity",
      "price",
      "total",
      "isGift",
      "metadata",
    ],
  },
  [ListViews.ORDER_DRAFT_DETAILS_LIST]: {
    rowNumber: PAGINATE_BY,
    columns: [
      "product",
      "status",
      "sku",
      "variantName",
      "quantity",
      "price",
      "total",
      "isGift",
      "metadata",
    ],
  },
  [ListViews.PRODUCT_DETAILS]: {
    rowNumber: PAGINATE_BY,
    columns: ["name", "sku"],
  },
  [ListViews.VOUCHER_CODES]: {
    rowNumber: PAGINATE_BY,
  },
};

export const APP_VERSION =
  process.env.CUSTOM_VERSION || `v${packageInfo.version}`;

export const DEMO_MODE = process.env.DEMO_MODE === "true";
export const GTM_ID = process.env.GTM_ID;

export const DEFAULT_NOTIFICATION_SHOW_TIME = 3000;
