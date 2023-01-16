import { MockedResponse } from "@apollo/client/testing";
import { SearchWarehousesDocument } from "@dashboard/graphql";

export const warehousesMocks: MockedResponse[] = [
  {
    request: {
      query: SearchWarehousesDocument,
      variables: {
        after: null,
        first: 20,
        query: "",
        PERMISSION_MANAGE_USERS: false,
        PERMISSION_MANAGE_STAFF: false,
        PERMISSION_IMPERSONATE_USER: false,
        PERMISSION_MANAGE_APPS: false,
        PERMISSION_MANAGE_OBSERVABILITY: false,
        PERMISSION_MANAGE_CHECKOUTS: false,
        PERMISSION_HANDLE_CHECKOUTS: false,
        PERMISSION_HANDLE_TAXES: false,
        PERMISSION_MANAGE_TAXES: false,
        PERMISSION_MANAGE_CHANNELS: false,
        PERMISSION_MANAGE_DISCOUNTS: false,
        PERMISSION_MANAGE_GIFT_CARD: false,
        PERMISSION_MANAGE_MENUS: false,
        PERMISSION_MANAGE_ORDERS: false,
        PERMISSION_MANAGE_PAGES: false,
        PERMISSION_MANAGE_PAGE_TYPES_AND_ATTRIBUTES: false,
        PERMISSION_HANDLE_PAYMENTS: false,
        PERMISSION_MANAGE_PLUGINS: false,
        PERMISSION_MANAGE_PRODUCTS: false,
        PERMISSION_MANAGE_PRODUCT_TYPES_AND_ATTRIBUTES: false,
        PERMISSION_MANAGE_SHIPPING: false,
        PERMISSION_MANAGE_SETTINGS: false,
        PERMISSION_MANAGE_TRANSLATIONS: false,
      },
    },
    result: {
      data: [],
    },
  },
];
