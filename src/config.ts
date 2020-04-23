import packageInfo from "../package.json";
import { SearchVariables } from "./hooks/makeSearch";
import { ListSettings, ListViews, Pagination } from "./types";

export const APP_MOUNT_URI = process.env.APP_MOUNT_URI || "/";
export const API_URI = process.env.API_URI;

export const DEFAULT_INITIAL_SEARCH_DATA: SearchVariables = {
  after: null,
  first: 20,
  query: ""
};

export const DEFAULT_INITIAL_PAGINATION_DATA: Pagination = {
  after: undefined,
  before: undefined
};

export const PAGINATE_BY = 20;

export type ProductListColumns = "productType" | "isPublished" | "price";
export interface AppListViewSettings {
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
  [ListViews.WEBHOOK_LIST]: ListSettings;
}
export const defaultListSettings: AppListViewSettings = {
  [ListViews.CATEGORY_LIST]: {
    rowNumber: PAGINATE_BY
  },
  [ListViews.COLLECTION_LIST]: {
    rowNumber: PAGINATE_BY
  },
  [ListViews.CUSTOMER_LIST]: {
    rowNumber: PAGINATE_BY
  },
  [ListViews.DRAFT_LIST]: {
    rowNumber: PAGINATE_BY
  },
  [ListViews.NAVIGATION_LIST]: {
    rowNumber: PAGINATE_BY
  },
  [ListViews.ORDER_LIST]: {
    rowNumber: PAGINATE_BY
  },
  [ListViews.PAGES_LIST]: {
    rowNumber: PAGINATE_BY
  },
  [ListViews.PLUGINS_LIST]: {
    rowNumber: PAGINATE_BY
  },
  [ListViews.PRODUCT_LIST]: {
    columns: ["isPublished", "price", "productType"],
    rowNumber: PAGINATE_BY
  },
  [ListViews.SALES_LIST]: {
    rowNumber: PAGINATE_BY
  },
  [ListViews.SHIPPING_METHODS_LIST]: {
    rowNumber: PAGINATE_BY
  },
  [ListViews.STAFF_MEMBERS_LIST]: {
    rowNumber: PAGINATE_BY
  },
  [ListViews.PERMISSION_GROUP_LIST]: {
    rowNumber: PAGINATE_BY
  },
  [ListViews.VOUCHER_LIST]: {
    rowNumber: PAGINATE_BY
  },
  [ListViews.WEBHOOK_LIST]: {
    rowNumber: PAGINATE_BY
  }
};

export const APP_VERSION = packageInfo.version;
