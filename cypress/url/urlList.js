export const urlList = {
  apiUri: Cypress.env("API_URI"),
  attributes: "attributes/",
  channels: "channels/",
  collections: "collections/",
  configuration: "configuration/",
  draftOrders: "orders/drafts/",
  homePage: "/",
  newPassword: "new-password/",
  orders: "orders/",
  pageTypes: "page-types/",
  permissionsGroups: "permission-groups/",
  products: "products/",
  productTypes: "product-types/",
  sales: "discounts/sales/",
  shippingMethods: "shipping/",
  staffMembers: "staff/",
  vouchers: "discounts/vouchers/",
  warehouses: "warehouses/",
  weightRete: "weight/"
};

export const productDetailsUrl = productId => `${urlList.products}${productId}`;

export const userDetailsUrl = userId => `${urlList.staffMembers}${userId}`;

export const staffMemberDetailsUrl = staffMemberId =>
  `${urlList.staffMembers}${staffMemberId}`;

export const permissionGroupDetails = permissionGroupId =>
  `${urlList.permissionsGroups}${permissionGroupId}`;

export const shippingZoneDetailsUrl = shippingZoneId =>
  `${urlList.shippingMethods}${shippingZoneId}`;

export const weightRateUrl = (shippingZoneId, weightRateId) =>
  `${urlList.shippingMethods}${shippingZoneId}/${urlList.weightRete}${weightRateId}`;

export const warehouseDetailsUrl = warehouseId =>
  `${urlList.warehouses}${warehouseId}`;

export const productTypeDetailsUrl = productTypeId =>
  `${urlList.productTypes}${productTypeId}`;

export const pageTypeDetailsUrl = pageTypeId =>
  `${urlList.pageTypes}${pageTypeId}`;
