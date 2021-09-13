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
  navigation: "navigation/",
  orders: "orders/",
  pages: "pages/",
  pageTypes: "page-types/",
  permissionsGroups: "permission-groups/",
  products: "products/",
  productTypes: "product-types/",
  sales: "discounts/sales/",
  shippingMethods: "shipping/",
  siteSettings: "site-settings/",
  staffMembers: "staff/",
  warehouses: "warehouses/",
  weightRete: "weight/",
  vouchers: "discounts/vouchers/"
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

export const menuDetailsUrl = menuId => `${urlList.navigation}${menuId}`;

export const customerDetailsUrl = customerId =>
  `${urlList.customers}${customerId}`;

export const pageTypeDetailsUrl = pageTypeId =>
  `${urlList.pageTypes}${pageTypeId}`;

export const appDetailsUrl = appId => `${urlList.apps}custom/${appId}`;
