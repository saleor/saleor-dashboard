export interface UserPermissionType {
  channel: string;
  shipping: string;
  giftCard: string;
  app: string;
  settings: string;
  page: string;
  order: string;
  translations: string;
  staff: string;
  customer: string;
  productTypeAndAttribute: string;
  discount: string;
  plugin: string;
  product: string;
}

export const USER_PERMISSION: UserPermissionType = {
  channel: "channel.manager@example.com",
  shipping: "shipping.manager@example.com",
  giftCard: "gift.card.manager@example.com",
  app: "app.manager@example.com",
  settings: "setting.manager@example.com",
  page: "page.manager@example.com",
  order: "order.manager@example.com",
  translations: "translation.manager@example.com",
  staff: "staff.manager@example.com",
  customer: "user.manager@example.com",
  productTypeAndAttribute: "product.type.and.attribute.manager@example.com",
  discount: "discount.manager@example.com",
  plugin: "plugin.manager@example.com",
  product: "product.manager@example.com",
};

export type UserPermission = keyof UserPermissionType;

export const permissions: Array<UserPermission> = [
  "app",
  "discount",
  "order",
  "channel",
  "customer",
  "giftCard",
  "page",
  "plugin",
  "productTypeAndAttribute",
  "product",
  "settings",
  "staff",
  "shipping",
  "translations",
];
