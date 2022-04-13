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
  giftCards: "gift-cards/",
  homePage: "/",
  newPassword: "new-password/",
  navigation: "navigation/",
  orders: "orders/",
  pages: "pages/",
  pageTypes: "page-types/",
  permissionsGroups: "permission-groups/",
  plugins: "plugins/",
  products: "products/",
  productTypes: "product-types/",
  sales: "discounts/sales/",
  shippingMethods: "shipping/",
  siteSettings: "site-settings/",
  staffMembers: "staff/",
  stripeApiPaymentMethods: "https://api.stripe.com/v1/payment_methods",
  translations: "translations/",
  variants: "variant/",
  vouchers: "discounts/vouchers/",
  variant: "variant/",
  warehouses: "warehouses/"
};

export const addVariantUrl = productId =>
  `${urlList.products}${productId}/${urlList.variants}add`;

export const appDetailsUrl = appId => `${urlList.apps}custom/${appId}`;

export const attributeDetailsUrl = attributeId =>
  `${urlList.attributes}${attributeId}`;

export const categoryDetailsUrl = categoryId =>
  `${urlList.categories}${categoryId}`;

export const collectionDetailsUrl = collectionId =>
  `${urlList.collections}${collectionId}`;

export const customerDetailsUrl = customerId =>
  `${urlList.customers}${customerId}`;

export const giftCardDetailsUrl = giftCardId =>
  `${urlList.giftCards}${giftCardId}`;

export const menuDetailsUrl = menuId => `${urlList.navigation}${menuId}`;

export const pageDetailsUrl = pageId => `${urlList.pages}${pageId}`;

export const pageTypeDetailsUrl = pageTypeId =>
  `${urlList.pageTypes}${pageTypeId}`;

export const permissionGroupDetails = permissionGroupId =>
  `${urlList.permissionsGroups}${permissionGroupId}`;

export const productDetailsUrl = productId => `${urlList.products}${productId}`;

export const productVariantDetailUrl = (productId, variantId) =>
  `${urlList.products}${productId}/${urlList.variants}${variantId}`;

export const productTypeDetailsUrl = productTypeId =>
  `${urlList.productTypes}${productTypeId}`;

export const staffMemberDetailsUrl = staffMemberId =>
  `${urlList.staffMembers}${staffMemberId}`;

export const shippingZoneDetailsUrl = shippingZoneId =>
  `${urlList.shippingMethods}${shippingZoneId}`;

export const userDetailsUrl = userId => `${urlList.staffMembers}${userId}`;

export const shippingRateUrl = (shippingZoneId, weightRateId) =>
  `${urlList.shippingMethods}${shippingZoneId}/${weightRateId}`;

export const warehouseDetailsUrl = warehouseId =>
  `${urlList.warehouses}${warehouseId}`;

export const saleDetailsUrl = saleId => `${urlList.sales}${saleId}`;

export const variantDetailsUrl = (productId, variantId) =>
  `${urlList.products}${productId}/${urlList.variants}${variantId}`;

export const voucherDetailsUrl = voucherId => `${urlList.vouchers}${voucherId}`;

export const stripeConfirmationUrl = id =>
  `https://api.stripe.com/v1/payment_intents/${id}/confirm`;
