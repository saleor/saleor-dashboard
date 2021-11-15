export const TEST_ADMIN_USER = {
  email: Cypress.env("USER_NAME"),
  password: Cypress.env("USER_PASSWORD"),
  name: "Test",
  lastName: "Test"
};
export const USER_WITHOUT_NAME = {
  email: Cypress.env("SECOND_USER_NAME"),
  password: Cypress.env("USER_PASSWORD")
};
export const ONE_PERMISSION_USERS = {
  channel: getOnePermissionUser("channel.manager@example.com"),
  shipping: getOnePermissionUser("shipping.manager@example.com"),
  giftCard: getOnePermissionUser("gift.card.manager@example.com"),
  app: getOnePermissionUser("app.manager@example.com"),
  settings: getOnePermissionUser("setting.manager@example.com"),
  page: getOnePermissionUser("page.manager@example.com"),
  order: getOnePermissionUser("order.manager@example.com"),
  translations: getOnePermissionUser("translation.manager@example.com"),
  menu: getOnePermissionUser("menu.manager@example.com"),
  staff: getOnePermissionUser("staff.manager@example.com"),
  user: getOnePermissionUser("user.manager@example.com"),
  pageTypeAndAttribute: getOnePermissionUser(
    "page.type.and.attribute.manager@example.com"
  ),
  productTypeAndAttribute: getOnePermissionUser(
    "product.type.and.attribute.manager@example.com"
  ),
  discount: getOnePermissionUser("discount.manager@example.com"),
  plugin: getOnePermissionUser("plugin.manager@example.com"),
  product: getOnePermissionUser("product.manager@example.com")
};
function getOnePermissionUser(email) {
  return { email, password: Cypress.env("PERMISSIONS_USERS_PASSWORD") };
}
