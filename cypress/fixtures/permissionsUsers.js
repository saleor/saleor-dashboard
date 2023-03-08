import { PERMISSIONS } from "./permissions";
import { ONE_PERMISSION_USERS } from "./users";

export const PERMISSIONS_OPTIONS = {
  app: {
    user: ONE_PERMISSION_USERS.app,
    permissions: [],
    testCase: "TC: SALEOR_3402",
  },
  channel: {
    user: ONE_PERMISSION_USERS.channel,
    permissions: [PERMISSIONS.channel, PERMISSIONS.taxes],
    testCase: "TC: SALEOR_3403",
  },
  customer: {
    user: ONE_PERMISSION_USERS.user,
    permissions: [PERMISSIONS.customer],
    testCase: "TC: SALEOR_3404",
  },
  discount: {
    user: ONE_PERMISSION_USERS.discount,
    permissions: [PERMISSIONS.discounts],
    testCase: "TC: SALEOR_3405",
  },
  giftCard: {
    user: ONE_PERMISSION_USERS.giftCard,
    testCase: "TC: SALEOR_3406",
  },
  order: {
    user: ONE_PERMISSION_USERS.order,
    permissions: [PERMISSIONS.order],
    testCase: "TC: SALEOR_3407",
  },
  page: {
    user: ONE_PERMISSION_USERS.page,
    permissions: [PERMISSIONS.page, PERMISSIONS.taxes],
    testCase: "TC: SALEOR_3408",
  },
  plugin: {
    user: ONE_PERMISSION_USERS.plugin,
    permissions: [PERMISSIONS.plugin, PERMISSIONS.taxes],
    testCase: "TC: SALEOR_3409",
  },
  product: {
    user: ONE_PERMISSION_USERS.product,
    permissions: [
      PERMISSIONS.product,
      PERMISSIONS.warehouse,
      PERMISSIONS.taxes,
    ],
    testCase: "TC: SALEOR_3410",
  },
  productTypeAndAttribute: {
    user: ONE_PERMISSION_USERS.productTypeAndAttribute,
    permissions: [PERMISSIONS.productTypeAndAttribute, PERMISSIONS.taxes],
    testCase: "TC: SALEOR_3411",
  },
  pageTypeAndAttribute: {
    user: ONE_PERMISSION_USERS.pageTypeAndAttribute,
    permissions: [PERMISSIONS.pageTypeAndAttribute, PERMISSIONS.taxes],
    testCase: "TC: SALEOR_3412",
  },
  settings: {
    user: ONE_PERMISSION_USERS.settings,
    permissions: [PERMISSIONS.settings, PERMISSIONS.taxes],
    testCase: "TC: SALEOR_3413",
  },
  staff: {
    user: ONE_PERMISSION_USERS.staff,
    permissions: [PERMISSIONS.staff, PERMISSIONS.taxes],
    testCase: "TC: SALEOR_3414",
  },
  shipping: {
    user: ONE_PERMISSION_USERS.shipping,
    permissions: [PERMISSIONS.shipping, PERMISSIONS.taxes],
    testCase: "TC: SALEOR_3415",
  },
  translations: {
    user: ONE_PERMISSION_USERS.translations,
    permissions: [PERMISSIONS.translations],
    testCase: "TC: SALEOR_3416",
  },
};
