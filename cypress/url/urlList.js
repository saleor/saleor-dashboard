export const urlList = {
  apiUri: Cypress.env("API_URI"),
  addProduct: "products/add",
  apps: "apps/",
  attributes: "attributes/",
  channels: "channels/",
  categories: "categories/",
  collections: "collections/",
  configuration: "configuration/",
  customers: "customers/",
  draftOrders: "orders/drafts/",
  homePage: "/",
  newPassword: "new-password/",
  orders: "orders/",
  pageTypes: "page-types/",
  permissionsGroups: "permission-groups/",
  products: "products/",
  productTypes: "product-types/",
  shippingMethods: "shipping/",
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

export const categoryDetails = categoryId =>
  `${urlList.categories}${categoryId}`;

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

export const appDetailsUrl = appId => `${urlList.apps}custom/${appId}`;
