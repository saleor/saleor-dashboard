import packageInfo from "../package.json";
import { SearchVariables } from "./hooks/makeSearch";
import { ListSettings, ListViews, Pagination } from "./types";

export const IS_TEST = process.env.NODE_ENV === "test";
export const APP_MOUNT_URI = IS_TEST ? "/" : process.env.APP_MOUNT_URI || "/";
export const APP_DEFAULT_URI = "/";
export const API_URI = process.env.API_URI;
export const SW_INTERVAL = parseInt(process.env.SW_INTERVAL, 10);
export const IS_CLOUD_INSTANCE = process.env.IS_CLOUD_INSTANCE === "true";
export const MARKETPLACE_URL = process.env.MARKETPLACE_URL;

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
    columns: ["availability", "price", "productType", "date"],
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

export const APP_VERSION = packageInfo.version;

export const DEMO_MODE = process.env.DEMO_MODE === "true";
export const GTM_ID = process.env.GTM_ID;

export const DEFAULT_NOTIFICATION_SHOW_TIME = 3000;
