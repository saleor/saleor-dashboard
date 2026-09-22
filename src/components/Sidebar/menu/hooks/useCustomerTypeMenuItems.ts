import { useUser } from "@dashboard/auth/useUser";
import { CUSTOMER_TYPE_TABS_PIN_STORAGE_KEY } from "@dashboard/customers/components/CustomerTypeTabs/CustomerTypeTabs";
import { customerListPath } from "@dashboard/customers/urls";
import {
  CustomerTypeSortField,
  OrderDirection,
  PermissionEnum,
  useCustomerTypeListQuery,
} from "@dashboard/graphql";
import { modelTypeTabsMessages } from "@dashboard/modeling/components/ModelTypeTabs/messages";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { useIntl } from "react-intl";
import { matchPath, useLocation } from "react-router";

import {
  createCustomerTypeMenuItems,
  getCustomerTypeIdsFromSearch,
} from "../createCustomerTypeMenuItems";
import { type SidebarMenuItem } from "../types";

const CUSTOMER_LIST_PERMISSIONS: PermissionEnum[] = [
  PermissionEnum.MANAGE_USERS,
  PermissionEnum.MANAGE_ORDERS,
  PermissionEnum.MANAGE_STAFF,
];

const readPinnedIds = (): string[] => {
  try {
    const raw = localStorage.getItem(CUSTOMER_TYPE_TABS_PIN_STORAGE_KEY);

    if (!raw) {
      return [];
    }

    const parsed: unknown = JSON.parse(raw);

    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === "string") : [];
  } catch {
    return [];
  }
};

export const useCustomerTypeMenuItems = (): SidebarMenuItem[] => {
  const intl = useIntl();
  const location = useLocation();
  const { user } = useUser();
  const userPermissions = (user?.userPermissions ?? []).map(permission => permission.code);
  const canListCustomers = CUSTOMER_LIST_PERMISSIONS.some(permission =>
    userPermissions.includes(permission),
  );
  const { data } = useCustomerTypeListQuery({
    skip: !canListCustomers,
    fetchPolicy: "cache-first",
    variables: {
      first: 100,
      sort: { field: CustomerTypeSortField.NAME, direction: OrderDirection.ASC },
    },
  });

  if (!canListCustomers) {
    return [];
  }

  const onCustomerList = Boolean(
    matchPath(location.pathname, { path: customerListPath, exact: true }),
  );

  return createCustomerTypeMenuItems({
    customerTypes: mapEdgesToItems(data?.customerTypes) ?? [],
    allLabel: intl.formatMessage(modelTypeTabsMessages.allTab),
    // Tab strip owns writes to this key — only read here so we cannot clobber pins.
    pinnedIds: readPinnedIds(),
    selectedTypeIds: onCustomerList ? getCustomerTypeIdsFromSearch(location.search) : [],
  });
};
