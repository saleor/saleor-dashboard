import { useUserPermissions } from "@dashboard/auth/hooks/useUserPermissions";
import {
  AppExtensionMountEnum,
  AppExtensionTargetEnum,
  ExtensionListQuery,
  PermissionEnum,
  useExtensionListQuery,
} from "@dashboard/graphql";
import { RelayToFlat } from "@dashboard/types";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import React from "react";

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
  open?: () => void;
  target: AppExtensionTargetEnum;
}

export interface ExtensionWithParams extends Omit<Extension, "open"> {
  open?: (params: AppDetailsUrlMountQueryParams) => void;
}

interface MenuItem {
  label: string;
  testId?: string;
  onSelect?: <T extends AppDetailsUrlMountQueryParams>(params: T) => void;
  renderElement?: () => React.ReactNode;
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
  extensions.map(({ id, accessToken, permissions, url, label, mount, target, app }) => {
    const result: ExtensionWithParams = {
      target,
      id,
      app,
      accessToken: accessToken || "",
      permissions: permissions.map(({ code }) => code),
      url,
      label,
      mount,
    };

    if (target !== "NEW_TAB") {
      result.open = (params: AppDetailsUrlMountQueryParams) => {
        openApp({
          id: app.id,
          appToken: accessToken || "",
          src: url,
          label,
          target,
          params,
        });
      };
    }

    return result;
  });

const mapToMenuItem = ({ label, id, open, url, target }: ExtensionWithParams): MenuItem => {
  const result: MenuItem = {
    label,
    testId: `extension-${id}`,
  };

  if (target == "NEW_TAB") {
    result.renderElement = () => {
      return (
        <a href={url} target="_blank" rel="noreferrer">
          {label}
        </a>
      );
    };
  } else {
    result.onSelect = open;
  }

  return result;
};

export const mapToMenuItems = (extensions: ExtensionWithParams[]): MenuItem[] =>
  extensions.map(mapToMenuItem);

export const mapToMenuItemsForOrderListActions = (
  extensions: ExtensionWithParams[],
): MenuItem[] => {
  return extensions.map(extension => {
    const extensionToMap = { ...extension };

    if (typeof extension.open === "function") {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore - probably old TS?
      extensionToMap.open = () => extension.open({});
    }

    return mapToMenuItem(extensionToMap);
  });
};

export const mapToMenuItemsForProductOverviewActions = (
  extensions: ExtensionWithParams[],
  productIds: string[],
): MenuItem[] =>
  extensions.map(extension => {
    const extensionToMap = { ...extension };

    if (typeof extension.open === "function") {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore - probably old TS?
      extensionToMap.open = () => extension.open({ productIds });
    }

    return mapToMenuItem(extensionToMap);
  });

export const mapToMenuItemsForProductDetails = (
  extensions: ExtensionWithParams[],
  productId: string,
): MenuItem[] =>
  extensions.map(extension => {
    const extensionToMap = { ...extension };

    if (typeof extension.open === "function") {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore - probably old TS?
      extensionToMap.open = () => extension.open({ productId });
    }

    return mapToMenuItem(extensionToMap);
  });

export const mapToMenuItemsForCustomerDetails = (
  extensions: ExtensionWithParams[],
  customerId: string,
): MenuItem[] =>
  extensions.map(extension => {
    const extensionToMap = { ...extension };

    if (typeof extension.open === "function") {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore - probably old TS?
      extensionToMap.open = () => extension.open({ customerId });
    }

    return mapToMenuItem(extensionToMap);
  });

export const mapToMenuItemsForCustomerOverviewActions = (
  extensions: ExtensionWithParams[],
  customerIds: string[],
): MenuItem[] =>
  extensions.map(extension => {
    const extensionToMap = { ...extension };

    if (typeof extension.open === "function") {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore - probably old TS?
      extensionToMap.open = () => extension.open({ customerIds });
    }

    return mapToMenuItem(extensionToMap);
  });

export const mapToMenuItemsForOrderDetails = (
  extensions: ExtensionWithParams[],
  orderId?: string,
): MenuItem[] =>
  extensions.map(extension => {
    const extensionToMap = { ...extension };

    if (typeof extension.open === "function") {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore - probably old TS?
      extensionToMap.open = () => extension.open({ orderId });
    }

    return mapToMenuItem(extensionToMap);
  });

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
