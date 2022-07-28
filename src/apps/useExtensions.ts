import { useUserPermissions } from "@saleor/auth/hooks/useUserPermissions";
import {
  AppExtensionMountEnum,
  ExtensionListQuery,
  PermissionEnum,
  useExtensionListQuery,
} from "@saleor/graphql";
import { RelayToFlat } from "@saleor/types";
import { mapEdgesToItems } from "@saleor/utils/maps";

import { AppData, useExternalApp } from "./components/ExternalAppContext";
import { AppDetailsUrlMountQueryParams } from "./urls";

export interface Extension {
  id: string;
  app: RelayToFlat<ExtensionListQuery["appExtensions"]>[0]["app"];
  accessToken: string;
  permissions: PermissionEnum[];
  label: string;
  mount: AppExtensionMountEnum;
  url: string;
  open(): void;
}

export interface ExtensionWithParams extends Omit<Extension, "open"> {
  open(params: AppDetailsUrlMountQueryParams): void;
}

export const extensionMountPoints = {
  PRODUCT_LIST: [
    AppExtensionMountEnum.PRODUCT_OVERVIEW_CREATE,
    AppExtensionMountEnum.PRODUCT_OVERVIEW_MORE_ACTIONS,
  ],
  ORDER_LIST: [
    AppExtensionMountEnum.ORDER_OVERVIEW_CREATE,
    AppExtensionMountEnum.ORDER_OVERVIEW_MORE_ACTIONS,
  ],
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
  extensions: RelayToFlat<ExtensionListQuery["appExtensions"]>,
  openApp: (appData: AppData) => void,
): ExtensionWithParams[] =>
  extensions.map(
    ({ id, accessToken, permissions, url, label, mount, target, app }) => ({
      id,
      app,
      accessToken,
      permissions: permissions.map(({ code }) => code),
      url,
      label,
      mount,
      open: (params: AppDetailsUrlMountQueryParams) =>
        openApp({
          id: app.id,
          appToken: accessToken,
          src: url,
          label,
          target,
          params,
        }),
    }),
  );

const mapToMenuItem = ({ label, id, open }: Extension) => ({
  label,
  testId: `extension-${id}`,
  onSelect: open,
});

export const mapToMenuItems = (extensions: ExtensionWithParams[]) =>
  extensions.map(mapToMenuItem);

export const mapToMenuItemsForProductDetails = (
  extensions: ExtensionWithParams[],
  productId: string,
) =>
  extensions.map(extension =>
    mapToMenuItem({ ...extension, open: () => extension.open({ productId }) }),
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
  const extensionsPermissions = permissions?.find(
    perm => perm.code === PermissionEnum.MANAGE_APPS,
  );

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
    mapEdgesToItems(data?.appExtensions) || [],
    openApp,
  );

  const extensionsMap = mountList.reduce(
    (extensionsMap, mount) => ({ ...extensionsMap, [mount]: [] }),
    {} as Record<T, Extension[]>,
  );

  return extensions.reduce(
    (prevExtensionsMap, extension) => ({
      ...prevExtensionsMap,
      [extension.mount]: [
        ...(prevExtensionsMap[extension.mount] || []),
        extension,
      ],
    }),
    extensionsMap,
  );
};
