import { AppExtensionMountEnum } from "@dashboard/graphql";

export const extensionMountPoints = {
  CATEGORY_LIST: [
    AppExtensionMountEnum.CATEGORY_OVERVIEW_CREATE,
    AppExtensionMountEnum.CATEGORY_OVERVIEW_MORE_ACTIONS,
  ],
  COLLECTION_LIST: [
    AppExtensionMountEnum.COLLECTION_OVERVIEW_CREATE,
    AppExtensionMountEnum.COLLECTION_OVERVIEW_MORE_ACTIONS,
  ],
  GIFT_CARD_LIST: [
    AppExtensionMountEnum.GIFT_CARD_OVERVIEW_CREATE,
    AppExtensionMountEnum.GIFT_CARD_OVERVIEW_MORE_ACTIONS,
  ],
  CUSTOMER_LIST: [
    AppExtensionMountEnum.CUSTOMER_OVERVIEW_CREATE,
    AppExtensionMountEnum.CUSTOMER_OVERVIEW_MORE_ACTIONS,
  ],
  PRODUCT_LIST: [
    AppExtensionMountEnum.PRODUCT_OVERVIEW_CREATE,
    AppExtensionMountEnum.PRODUCT_OVERVIEW_MORE_ACTIONS,
  ],
  ORDER_LIST: [
    AppExtensionMountEnum.ORDER_OVERVIEW_CREATE,
    AppExtensionMountEnum.ORDER_OVERVIEW_MORE_ACTIONS,
  ],
  DRAFT_ORDER_LIST: [
    AppExtensionMountEnum.DRAFT_ORDER_OVERVIEW_CREATE,
    AppExtensionMountEnum.DRAFT_ORDER_OVERVIEW_MORE_ACTIONS,
  ],
  DISCOUNT_LIST: [
    AppExtensionMountEnum.DISCOUNT_OVERVIEW_CREATE,
    AppExtensionMountEnum.DISCOUNT_OVERVIEW_MORE_ACTIONS,
  ],
  VOUCHER_LIST: [
    AppExtensionMountEnum.VOUCHER_OVERVIEW_CREATE,
    AppExtensionMountEnum.VOUCHER_OVERVIEW_MORE_ACTIONS,
  ],
  PAGE_LIST: [
    AppExtensionMountEnum.PAGE_OVERVIEW_CREATE,
    AppExtensionMountEnum.PAGE_OVERVIEW_MORE_ACTIONS,
  ],
  PAGE_TYPE_LIST: [
    AppExtensionMountEnum.PAGE_TYPE_OVERVIEW_CREATE,
    AppExtensionMountEnum.PAGE_TYPE_OVERVIEW_MORE_ACTIONS,
  ],
  MENU_LIST: [
    AppExtensionMountEnum.MENU_OVERVIEW_CREATE,
    AppExtensionMountEnum.MENU_OVERVIEW_MORE_ACTIONS,
  ],
  COLLECTION_DETAILS: [
    AppExtensionMountEnum.COLLECTION_DETAILS_MORE_ACTIONS,
    AppExtensionMountEnum.COLLECTION_DETAILS_WIDGETS,
  ],
  CATEGORY_DETAILS: [AppExtensionMountEnum.CATEGORY_DETAILS_MORE_ACTIONS],
  GIFT_CARD_DETAILS: [
    AppExtensionMountEnum.GIFT_CARD_DETAILS_MORE_ACTIONS,
    AppExtensionMountEnum.GIFT_CARD_DETAILS_WIDGETS,
  ],
  CUSTOMER_DETAILS: [
    AppExtensionMountEnum.CUSTOMER_DETAILS_MORE_ACTIONS,
    AppExtensionMountEnum.CUSTOMER_DETAILS_WIDGETS,
  ],
  ORDER_DETAILS: [
    AppExtensionMountEnum.ORDER_DETAILS_MORE_ACTIONS,
    AppExtensionMountEnum.ORDER_DETAILS_WIDGETS,
  ],
  DRAFT_ORDER_DETAILS: [
    AppExtensionMountEnum.DRAFT_ORDER_DETAILS_MORE_ACTIONS,
    AppExtensionMountEnum.DRAFT_ORDER_DETAILS_WIDGETS,
  ],
  PRODUCT_DETAILS: [
    AppExtensionMountEnum.PRODUCT_DETAILS_MORE_ACTIONS,
    AppExtensionMountEnum.PRODUCT_DETAILS_WIDGETS,
  ],
  DISCOUNT_DETAILS: [AppExtensionMountEnum.DISCOUNT_DETAILS_MORE_ACTIONS],
  VOUCHER_DETAILS: [
    AppExtensionMountEnum.VOUCHER_DETAILS_MORE_ACTIONS,
    AppExtensionMountEnum.VOUCHER_DETAILS_WIDGETS,
  ],
  PAGE_DETAILS: [AppExtensionMountEnum.PAGE_DETAILS_MORE_ACTIONS],
  PAGE_TYPE_DETAILS: [AppExtensionMountEnum.PAGE_TYPE_DETAILS_MORE_ACTIONS],
  MENU_DETAILS: [AppExtensionMountEnum.MENU_DETAILS_MORE_ACTIONS],
  NAVIGATION_SIDEBAR: [
    AppExtensionMountEnum.NAVIGATION_CATALOG,
    AppExtensionMountEnum.NAVIGATION_CUSTOMERS,
    AppExtensionMountEnum.NAVIGATION_DISCOUNTS,
    AppExtensionMountEnum.NAVIGATION_ORDERS,
    AppExtensionMountEnum.NAVIGATION_PAGES,
    AppExtensionMountEnum.NAVIGATION_TRANSLATIONS,
  ],
};
