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
  newPassword: "new-password/",
  permissionsGroups: "permission-groups/",
  weightRete: "weight/",
  attributes: "attributes/",
  productTypes: "product-types/",
  apps: "apps/",
  customers: "customers/"
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

export const customerDetailsUrl = customerId =>
  `${urlList.customers}${customerId}`;

export const appDetailsUrl = appId => `${urlList.apps}custom/${appId}`;
