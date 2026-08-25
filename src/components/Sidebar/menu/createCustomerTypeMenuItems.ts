import { customerListUrlWithCustomerType } from "@dashboard/customers/urls";
import { PermissionEnum } from "@dashboard/graphql";

import { type SidebarMenuItem } from "./types";

export const CUSTOMER_TYPE_NAV_ID_PREFIX = "customer-type-nav-";
export const CUSTOMER_TYPE_NAV_ALL_ID = `${CUSTOMER_TYPE_NAV_ID_PREFIX}all`;

/**
 * Sidebar type shortcuts stay a handful. The customer list tabs (and All) cover
 * the rest — a long submenu is worse than a missing type.
 */
export const MAX_CUSTOMER_TYPE_NAV_TYPES = 8;

const customerListPermissions = [
  PermissionEnum.MANAGE_USERS,
  PermissionEnum.MANAGE_ORDERS,
  PermissionEnum.MANAGE_STAFF,
];

export const isCustomerTypeNavItem = (menuItem: Pick<SidebarMenuItem, "id">): boolean =>
  menuItem.id.startsWith(CUSTOMER_TYPE_NAV_ID_PREFIX);

export const getQueryListFilterValues = (urlOrSearch: string, filterKey: string): string[] => {
  const query = urlOrSearch.includes("?") ? (urlOrSearch.split("?")[1] ?? "") : urlOrSearch;
  const values: string[] = [];

  new URLSearchParams(query).forEach((value, key) => {
    if ((key === filterKey || key.startsWith(`${filterKey}[`)) && value) {
      values.push(value);
    }
  });

  return [...new Set(values)];
};

export const getCustomerTypeIdsFromSearch = (search: string): string[] =>
  getQueryListFilterValues(search, "customerTypes");

export const selectCustomerTypesForNav = ({
  customerTypes,
  pinnedIds,
  selectedTypeIds,
  limit = MAX_CUSTOMER_TYPE_NAV_TYPES,
}: {
  customerTypes: Array<{ id: string; name: string }>;
  pinnedIds: string[];
  selectedTypeIds: string[];
  limit?: number;
}): Array<{ id: string; name: string }> => {
  const byId = new Map(customerTypes.map(customerType => [customerType.id, customerType]));
  const pinned = pinnedIds
    .map(id => byId.get(id))
    .filter((customerType): customerType is { id: string; name: string } => Boolean(customerType));
  const pinnedIdSet = new Set(pinned.map(customerType => customerType.id));
  const unpinned = customerTypes.filter(customerType => !pinnedIdSet.has(customerType.id));
  const visible = [...pinned, ...unpinned].slice(0, limit);
  const selectedId = selectedTypeIds.length === 1 ? selectedTypeIds[0] : undefined;
  const selectedType = selectedId ? byId.get(selectedId) : undefined;

  if (selectedType && !visible.some(customerType => customerType.id === selectedType.id)) {
    return [...visible.slice(0, Math.max(0, limit - 1)), selectedType];
  }

  return visible;
};

const createCustomerTypeNavItem = ({
  id,
  label,
  url,
}: {
  id: string;
  label: string;
  url: string;
}): SidebarMenuItem => ({
  id,
  label,
  url,
  permissions: customerListPermissions,
  type: "item",
});

export const createCustomerTypeMenuItems = ({
  customerTypes,
  allLabel,
  pinnedIds = [],
  selectedTypeIds = [],
}: {
  customerTypes: Array<{ id: string; name: string }>;
  allLabel: string;
  pinnedIds?: string[];
  selectedTypeIds?: string[];
}): SidebarMenuItem[] => [
  createCustomerTypeNavItem({
    id: CUSTOMER_TYPE_NAV_ALL_ID,
    label: allLabel,
    url: customerListUrlWithCustomerType(),
  }),
  ...selectCustomerTypesForNav({
    customerTypes,
    pinnedIds,
    selectedTypeIds,
  }).map(customerType =>
    createCustomerTypeNavItem({
      id: `${CUSTOMER_TYPE_NAV_ID_PREFIX}${customerType.id}`,
      label: customerType.name,
      url: customerListUrlWithCustomerType(customerType),
    }),
  ),
];
