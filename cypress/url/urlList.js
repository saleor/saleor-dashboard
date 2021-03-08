export const urlList = {
  apiUri: Cypress.env("API_URI"),
  channels: "channels/",
  configuration: "configuration/",
  homePage: "/",
  orders: "orders/",
  products: "products/",
  warehouses: "warehouses/",
  collections: "collections/",
  shippingMethods: "shipping/"
};
export const productDetailsUrl = productId => `${urlList.products}${productId}`;
export const shippingDetailsUrl = shippingZoneId =>
  `${urlList.shippingMethods}${shippingZoneId}`;
