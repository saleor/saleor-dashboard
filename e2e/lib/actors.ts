import { ADMIN, STAFF_PASSWORD } from "../config.ts";

/**
 * `populatedb` mints one staff user per permission, deriving the address from the
 * permission codename - `manage_gift_card` becomes `gift.card.manager@example.com`
 * (see `create_staffs` in Saleor's `saleor/core/utils/random_data.py`). Each lands in a
 * group holding that single permission, which is what makes them useful for asserting
 * what the dashboard hides.
 *
 * `admin` is the superuser `populatedb --createsuperuser` creates. `anonymous` carries
 * no stored session at all - for specs that sign in through the UI themselves.
 */
export const PERMISSION_ACTORS = {
  app: "app.manager@example.com",
  channel: "channel.manager@example.com",
  customer: "user.manager@example.com",
  discount: "discount.manager@example.com",
  giftCard: "gift.card.manager@example.com",
  order: "order.manager@example.com",
  page: "page.manager@example.com",
  plugin: "plugin.manager@example.com",
  product: "product.manager@example.com",
  productTypeAndAttribute: "product.type.and.attribute.manager@example.com",
  settings: "setting.manager@example.com",
  shipping: "shipping.manager@example.com",
  staff: "staff.manager@example.com",
  translations: "translation.manager@example.com",
} as const;

export type PermissionActor = keyof typeof PERMISSION_ACTORS;

/**
 * Deliberately open beyond the permission users: a scenario that seeds its own staff
 * member (two permissions, deactivated, no group) names it here without touching this map.
 */
export type Actor = PermissionActor | "admin" | "anonymous" | (string & {});

export const credentialsFor = (actor: Actor): { email: string; password: string } => {
  if (actor === "admin") {
    return ADMIN;
  }

  if (actor === "anonymous") {
    throw new Error("the anonymous actor has no credentials");
  }

  const email = PERMISSION_ACTORS[actor as PermissionActor] ?? actor;

  return { email, password: STAFF_PASSWORD };
};

export const permissionActors = Object.keys(PERMISSION_ACTORS) as PermissionActor[];
