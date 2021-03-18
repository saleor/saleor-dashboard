export const urlList = {
  apiUri: Cypress.env("API_URI"),
  channels: "channels/",
  configuration: "configuration/",
  draftOrders: "orders/drafts/",
  homePage: "/",
  orders: "orders/",
  products: "products/",
  warehouses: "warehouses/",
  collections: "collections/",
  shippingMethods: "shipping/",
  sales: "discounts/sales/"
};
export const productDetailsUrl = productId => `${urlList.products}${productId}`;
