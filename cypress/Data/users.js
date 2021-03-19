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
export const PERMISSION_USERS = {
  password: Cypress.env("PERMISSIONS_USERS_PASSWORD"),
  emails: {
    shipping: "shipping.manager@example.com"
  }
};
