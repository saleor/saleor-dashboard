export const urlList = {
  apiUri: Cypress.env("API_URI"),
  channels: "channels/",
  configuration: "configuration/",
  draftOrders: "orders/drafts/",
  homePage: "/",
  orders: "orders/",
  products: "products/",
  warehouses: "warehouses/",
  shippingMethods: "shipping/",
  sales: "discounts/sales/",
  collections: "collections/",
  vouchers: "discounts/vouchers/",
  staffMembers: "staff/",
  permissionsGroups: "permission-groups/"
};
export const productDetailsUrl = productId => `${urlList.products}${productId}`;
export const staffMemberDetailsUrl = staffMemberId =>
  `${urlList.staffMembers}${staffMemberId}`;
export const permissionGroupDetails = permissionGroupId =>
  `${urlList.permissionsGroups}${permissionGroupId}`;
