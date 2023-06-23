// @ts-strict-ignore
import packageInfo from "../package.json";
import { SearchVariables } from "./hooks/makeSearch";
import { ListSettings, ListViews, Pagination } from "./types";

export const getAppDefaultUri = () => "/";
export const getAppMountUri = () =>
  window?.__SALEOR_CONFIG__?.APP_MOUNT_URI || getAppDefaultUri();
export const getApiUrl = () => window.__SALEOR_CONFIG__.API_URL;
export const SW_INTERVAL = parseInt(process.env.SW_INTERVAL, 10) || 300;
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
  | "productType"
  | "description"
  | "availability"
  | "price"
  | "date";

export interface AppListViewSettings {
  [ListViews.APPS_LIST]: ListSettings;
  [ListViews.ATTRIBUTE_VALUE_LIST]: ListSettings;
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
  [ListViews.SHIPPING_METHODS_LIST]: ListSettings;
  [ListViews.STAFF_MEMBERS_LIST]: ListSettings;
  [ListViews.PERMISSION_GROUP_LIST]: ListSettings;
  [ListViews.VOUCHER_LIST]: ListSettings;
  [ListViews.WAREHOUSE_LIST]: ListSettings;
  [ListViews.WEBHOOK_LIST]: ListSettings;
  [ListViews.TRANSLATION_ATTRIBUTE_VALUE_LIST]: ListSettings;
  [ListViews.GIFT_CARD_LIST]: ListSettings;
}

export const defaultListSettings: AppListViewSettings = {
  [ListViews.APPS_LIST]: {
    rowNumber: 100,
  },
  [ListViews.ATTRIBUTE_VALUE_LIST]: {
    rowNumber: 10,
  },
  [ListViews.CATEGORY_LIST]: {
    rowNumber: PAGINATE_BY,
  },
  [ListViews.COLLECTION_LIST]: {
    rowNumber: PAGINATE_BY,
  },
  [ListViews.CUSTOMER_LIST]: {
    rowNumber: PAGINATE_BY,
  },
  [ListViews.DRAFT_LIST]: {
    rowNumber: PAGINATE_BY,
  },
  [ListViews.NAVIGATION_LIST]: {
    rowNumber: PAGINATE_BY,
  },
  [ListViews.ORDER_LIST]: {
    rowNumber: PAGINATE_BY,
  },
  [ListViews.PAGES_LIST]: {
    rowNumber: PAGINATE_BY,
  },
  [ListViews.PLUGINS_LIST]: {
    rowNumber: PAGINATE_BY,
  },
  [ListViews.PRODUCT_LIST]: {
    columns: ["availability", "description", "price", "productType", "date"],
    rowNumber: PAGINATE_BY,
  },
  [ListViews.SALES_LIST]: {
    rowNumber: PAGINATE_BY,
  },
  [ListViews.SHIPPING_METHODS_LIST]: {
    rowNumber: PAGINATE_BY,
  },
  [ListViews.STAFF_MEMBERS_LIST]: {
    rowNumber: PAGINATE_BY,
  },
  [ListViews.PERMISSION_GROUP_LIST]: {
    rowNumber: PAGINATE_BY,
  },
  [ListViews.VOUCHER_LIST]: {
    rowNumber: PAGINATE_BY,
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
  },
};

export const APP_VERSION =
  process.env.CUSTOM_VERSION || `v${packageInfo.version}`;

export const DEMO_MODE = process.env.DEMO_MODE === "true";
export const GTM_ID = process.env.GTM_ID;

export const DEFAULT_NOTIFICATION_SHOW_TIME = 3000;
