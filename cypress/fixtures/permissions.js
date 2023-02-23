import * as menuSelectors from "../elements/account/left-menu/left-menu-selectors";
import { CONFIGURATION_SELECTORS } from "../elements/configuration/configuration-selectors";

const configurationAsParent = {
  parentMenuSelector: menuSelectors.MENU.configuration,
  parentSelectors: CONFIGURATION_SELECTORS,
};

export const PERMISSIONS = {
  channel: {
    parent: configurationAsParent,
    permissionSelectors: [CONFIGURATION_SELECTORS.channels],
  },
  customer: {
    permissionSelectors: [menuSelectors.MENU.customers],
  },
  discounts: {
    parent: {
      parentMenuSelector: menuSelectors.MENU.discounts,
      parentSelectors: [menuSelectors.DISCOUNTS],
    },
    permissionSelectors: [
      menuSelectors.DISCOUNTS.sales,
      menuSelectors.DISCOUNTS.vouchers,
    ],
  },
  order: {
    parent: {
      parentMenuSelector: menuSelectors.MENU.orders,
      parentSelectors: menuSelectors.ORDERS,
    },
    permissionSelectors: [
      menuSelectors.ORDERS.orders,
      menuSelectors.ORDERS.draftOrders,
    ],
  },
  page: {
    parent: configurationAsParent,
    permissionSelectors: [
      CONFIGURATION_SELECTORS.pageTypes,
      menuSelectors.MENU.pages,
    ],
  },
  plugin: {
    parent: configurationAsParent,
    permissionSelectors: [CONFIGURATION_SELECTORS.plugin],
  },
  product: {
    parent: {
      parentMenuSelector: menuSelectors.MENU.catalog,
      parentSelectors: menuSelectors.CATALOG,
    },
    permissionSelectors: [
      menuSelectors.CATALOG.categories,
      menuSelectors.CATALOG.collections,
      menuSelectors.CATALOG.products,
    ],
  },
  productTypeAndAttribute: {
    parent: configurationAsParent,
    permissionSelectors: [
      CONFIGURATION_SELECTORS.attributes,
      CONFIGURATION_SELECTORS.productTypes,
    ],
  },
  pageTypeAndAttribute: {
    parent: configurationAsParent,
    permissionSelectors: [
      CONFIGURATION_SELECTORS.pageTypes,
      CONFIGURATION_SELECTORS.attributes,
    ],
  },
  settings: {
    parent: configurationAsParent,
    permissionSelectors: [
      CONFIGURATION_SELECTORS.taxes,
      CONFIGURATION_SELECTORS.settings,
    ],
  },
  shipping: {
    parent: configurationAsParent,
    permissionSelectors: [CONFIGURATION_SELECTORS.shipping],
  },
  staff: {
    parent: configurationAsParent,
    permissionSelectors: [
      CONFIGURATION_SELECTORS.staffMembers,
      CONFIGURATION_SELECTORS.permissionGroups,
    ],
  },
  translations: {
    permissionSelectors: [menuSelectors.MENU.translations],
  },
  warehouse: {
    parent: configurationAsParent,
    permissionSelectors: [CONFIGURATION_SELECTORS.warehouse],
  },
  taxes: {
    parent: configurationAsParent,
    permissionSelectors: [CONFIGURATION_SELECTORS.taxes],
  },
};
