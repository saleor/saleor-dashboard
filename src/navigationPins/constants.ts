import { PermissionEnum } from "@dashboard/graphql";
import { commonMessages, sectionNames } from "@dashboard/intl";
import { defineMessages, type MessageDescriptor } from "react-intl";

/** Metadata key used on both `me` and `Shop`. */
export const NAVIGATION_PINS_METADATA_KEY = "dashboard-navigation-pins";

export const FAVORITES_TARGET_ID = "favorites";

/** Per target section, per scope. */
export const MAX_PINS_PER_TARGET = 3;

export const messages = defineMessages({
  favorites: {
    id: "6fll1+",
    defaultMessage: "Favorites",
    description: "sidebar section holding pinned model types",
  },
});

export interface PinTarget {
  id: string;
  label: MessageDescriptor;
  /**
   * Mirrors the target section's own permissions in `useMenuStructure`. A pin is only
   * offered — and only rendered — when the user can see the section hosting it.
   */
  permissions: PermissionEnum[];
  /** Organization pins cannot target Favorites. */
  organizationAllowed: boolean;
}

export const PIN_TARGETS: PinTarget[] = [
  {
    id: FAVORITES_TARGET_ID,
    label: messages.favorites,
    permissions: [],
    organizationAllowed: false,
  },
  {
    id: "products",
    label: sectionNames.catalog,
    permissions: [
      PermissionEnum.MANAGE_GIFT_CARD,
      PermissionEnum.MANAGE_PRODUCTS,
      PermissionEnum.MANAGE_PRODUCT_TYPES_AND_ATTRIBUTES,
    ],
    organizationAllowed: true,
  },
  {
    id: "orders",
    label: sectionNames.fulfillment,
    permissions: [PermissionEnum.MANAGE_ORDERS],
    organizationAllowed: true,
  },
  {
    id: "customers",
    label: sectionNames.customers,
    permissions: [
      PermissionEnum.MANAGE_USERS,
      PermissionEnum.MANAGE_ORDERS,
      PermissionEnum.MANAGE_STAFF,
    ],
    organizationAllowed: true,
  },
  {
    id: "discounts",
    label: commonMessages.discounts,
    permissions: [PermissionEnum.MANAGE_DISCOUNTS],
    organizationAllowed: true,
  },
  {
    id: "modeling",
    label: sectionNames.modeling,
    permissions: [
      PermissionEnum.MANAGE_PAGES,
      PermissionEnum.MANAGE_MENUS,
      PermissionEnum.MANAGE_PAGE_TYPES_AND_ATTRIBUTES,
    ],
    organizationAllowed: true,
  },
  {
    id: "translations",
    label: sectionNames.translations,
    permissions: [PermissionEnum.MANAGE_TRANSLATIONS],
    organizationAllowed: true,
  },
];

export const getPinTarget = (id: string): PinTarget | undefined =>
  PIN_TARGETS.find(target => target.id === id);
