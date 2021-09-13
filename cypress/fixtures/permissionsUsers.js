import { PERMISSIONS } from "./permissions";
import { ONE_PERMISSION_USERS, TEST_ADMIN_USER } from "./users";

export const PERMISSIONS_OPTIONS = {
  all: {
    user: TEST_ADMIN_USER,
    permissions: Object.values(PERMISSIONS)
  },
  app: {
    user: ONE_PERMISSION_USERS.app,
    permissions: [PERMISSIONS.app]
  },
  channel: {
    user: ONE_PERMISSION_USERS.channel,
    permissions: [PERMISSIONS.channel]
  },
  customer: {
    user: ONE_PERMISSION_USERS.user,
    permissions: [PERMISSIONS.customer]
  },
  discount: {
    user: ONE_PERMISSION_USERS.discount,
    permissions: [PERMISSIONS.discounts]
  },
  giftCard: {
    user: ONE_PERMISSION_USERS.giftCard
  },
  order: {
    user: ONE_PERMISSION_USERS.order,
    permissions: [PERMISSIONS.order]
  },
  page: {
    user: ONE_PERMISSION_USERS.page,
    permissions: [PERMISSIONS.page]
  },
  pageTypeAndAttribute: {
    user: ONE_PERMISSION_USERS.pageTypeAndAttribute
  },
  plugin: {
    user: ONE_PERMISSION_USERS.plugin,
    permissions: [PERMISSIONS.plugin]
  },
  product: {
    user: ONE_PERMISSION_USERS.product,
    permissions: [PERMISSIONS.product, PERMISSIONS.warehouse]
  },
  productTypeAndAttribute: {
    user: ONE_PERMISSION_USERS.productTypeAndAttribute,
    permissions: [PERMISSIONS.productTypeAndAttribute]
  },
  settings: {
    user: ONE_PERMISSION_USERS.settings,
    permissions: [PERMISSIONS.settings]
  },
  shipping: {
    user: ONE_PERMISSION_USERS.shipping,
    permissions: [PERMISSIONS.shipping]
  },
  staff: {
    user: ONE_PERMISSION_USERS.staff,
    permissions: [PERMISSIONS.staff]
  },
  translations: {
    user: ONE_PERMISSION_USERS.translations,
    permissions: [PERMISSIONS.translations]
  }
};
