import { useUserPermissions } from "@dashboard/auth/hooks/useUserPermissions";
import {
  AppExtensionMountEnum,
  ExtensionListQuery,
  PermissionEnum,
  useExtensionListQuery,
} from "@dashboard/graphql";
import { RelayToFlat } from "@dashboard/types";
import { mapEdgesToItems } from "@dashboard/utils/maps";

import { useExternalApp } from "../components/ExternalAppContext";
import { AppData } from "../components/ExternalAppContext/context";
import { AppDetailsUrlMountQueryParams } from "../urls";

export interface Extension {
  id: string;
  app: RelayToFlat<NonNullable<ExtensionListQuery["appExtensions"]>>[0]["app"];
  accessToken: string;
  permissions: PermissionEnum[];
  label: string;
  mount: AppExtensionMountEnum;
  url: string;
  open: () => void;
}

interface ExtensionWithParams extends Omit<Extension, "open"> {
  open: (params: AppDetailsUrlMountQueryParams) => void;
}

export const extensionMountPoints = {
  CUSTOMER_LIST: [
    AppExtensionMountEnum.CUSTOMER_OVERVIEW_CREATE,
    AppExtensionMountEnum.CUSTOMER_OVERVIEW_MORE_ACTIONS,
  ],
  PRODUCT_LIST: [
    AppExtensionMountEnum.PRODUCT_OVERVIEW_CREATE,
    AppExtensionMountEnum.PRODUCT_OVERVIEW_MORE_ACTIONS,
  ],
  ORDER_LIST: [
    AppExtensionMountEnum.ORDER_OVERVIEW_CREATE,
    AppExtensionMountEnum.ORDER_OVERVIEW_MORE_ACTIONS,
  ],
  CUSTOMER_DETAILS: [AppExtensionMountEnum.CUSTOMER_DETAILS_MORE_ACTIONS],
  ORDER_DETAILS: [AppExtensionMountEnum.ORDER_DETAILS_MORE_ACTIONS],
  PRODUCT_DETAILS: [AppExtensionMountEnum.PRODUCT_DETAILS_MORE_ACTIONS],
  NAVIGATION_SIDEBAR: [
    AppExtensionMountEnum.NAVIGATION_CATALOG,
    AppExtensionMountEnum.NAVIGATION_CUSTOMERS,
    AppExtensionMountEnum.NAVIGATION_DISCOUNTS,
    AppExtensionMountEnum.NAVIGATION_ORDERS,
    AppExtensionMountEnum.NAVIGATION_PAGES,
    AppExtensionMountEnum.NAVIGATION_TRANSLATIONS,
  ],
};

const filterAndMapToTarget = (
  extensions: RelayToFlat<NonNullable<ExtensionListQuery["appExtensions"]>>,
  openApp: (appData: AppData) => void,
): ExtensionWithParams[] =>
  extensions.map(({ id, accessToken, permissions, url, label, mount, target, app }) => ({
    id,
    app,
    accessToken: accessToken || "",
    permissions: permissions.map(({ code }) => code),
    url,
    label,
    mount,
    open: (params: AppDetailsUrlMountQueryParams) =>
      openApp({
        id: app.id,
        appToken: accessToken || "",
        src: url,
        label,
        target,
        params,
      }),
  }));
const mapToMenuItem = ({ label, id, open }: ExtensionWithParams) => ({
  label,
  testId: `extension-${id}`,
  onSelect: open,
});

export const mapToMenuItems = (extensions: ExtensionWithParams[]) => extensions.map(mapToMenuItem);

export const mapToMenuItemsForOrderListActions = (extensions: ExtensionWithParams[]) =>
  extensions.map(extension => mapToMenuItem({ ...extension, open: () => extension.open({}) }));

export const mapToMenuItemsForProductOverviewActions = (
  extensions: ExtensionWithParams[],
  productIds: string[],
) =>
  extensions.map(extension =>
    mapToMenuItem({ ...extension, open: () => extension.open({ productIds }) }),
  );

export const mapToMenuItemsForProductDetails = (
  extensions: ExtensionWithParams[],
  productId: string,
) =>
  extensions.map(extension =>
    mapToMenuItem({ ...extension, open: () => extension.open({ productId }) }),
  );

export const mapToMenuItemsForCustomerDetails = (
  extensions: ExtensionWithParams[],
  customerId: string,
) =>
  extensions.map(extension =>
    mapToMenuItem({ ...extension, open: () => extension.open({ customerId }) }),
  );

export const mapToMenuItemsForCustomerOverviewActions = (
  extensions: ExtensionWithParams[],
  customerIds: string[],
) =>
  extensions.map(extension =>
    mapToMenuItem({
      ...extension,
      open: () => extension.open({ customerIds }),
    }),
  );

export const mapToMenuItemsForOrderDetails = (
  extensions: ExtensionWithParams[],
  orderId?: string,
) =>
  extensions.map(extension =>
    mapToMenuItem({
      ...extension,
      open: () => extension.open({ orderId }),
    }),
  );

export const useExtensions = <T extends AppExtensionMountEnum>(
  mountList: T[],
): Record<T, Extension[]> => {
  const { openApp } = useExternalApp();
  const permissions = useUserPermissions();
  const extensionsPermissions = permissions?.find(perm => perm.code === PermissionEnum.MANAGE_APPS);
  const { data } = useExtensionListQuery({
    fetchPolicy: "cache-first",
    variables: {
      filter: {
        mount: mountList,
      },
    },
    skip: !extensionsPermissions,
  });
  const extensions = filterAndMapToTarget(
    mapEdgesToItems(data?.appExtensions ?? undefined) || [],
    openApp,
  );
  const extensionsMap = mountList.reduce(
    (extensionsMap, mount) => ({ ...extensionsMap, [mount]: [] }),
    {} as Record<AppExtensionMountEnum, Extension[]>,
  );

  return extensions.reduce(
    (prevExtensionsMap, extension) => ({
      ...prevExtensionsMap,
      [extension.mount]: [...(prevExtensionsMap[extension.mount] || []), extension],
    }),
    extensionsMap,
  );
};
