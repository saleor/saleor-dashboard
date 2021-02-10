export const urlList = {
  apiUri: Cypress.env("API_URI"),
  channels: `${Cypress.env("APP_MOUNT_URI")}channels/`,
  configuration: `${Cypress.env("APP_MOUNT_URI")}configuration/`,
  homePage: Cypress.env("APP_MOUNT_URI"),
  orders: `${Cypress.env("APP_MOUNT_URI")}orders/`,
  products: `${Cypress.env("APP_MOUNT_URI")}products/`,
  warehouses: `${Cypress.env("APP_MOUNT_URI")}warehouses/`
};
