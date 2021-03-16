export const urlList = {
  apiUri: Cypress.env("API_URI"),
  channels: "channels/",
  configuration: "configuration/",
  draftOrders: "orders/drafts/",
  homePage: "/",
  orders: "orders/",
  products: "products/",
  warehouses: "warehouses/",
  sales: "discounts/sales/",
  collections: "collections/"
};
export const productDetailsUrl = productId => `${urlList.products}${productId}`;
