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
