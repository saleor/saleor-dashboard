import { FilterableMenuItem } from "@saleor/components/AppLayout/menuStructure";
import { SidebarMenuItem } from "@saleor/macaw-ui";
import {
  AppExtensionMountEnum,
  PermissionEnum
} from "@saleor/types/globalTypes";
import { mapEdgesToItems } from "@saleor/utils/maps";

import { AppData, useExternalApp } from "./components/ExternalAppContext";
import { useExtensionList } from "./queries";
import { ExtensionList_appExtensions_edges_node } from "./types/ExtensionList";
import { appDeepUrl } from "./urls";

interface Extension {
  id: string;
  appId: string;
  accessToken: string;
  permissions: PermissionEnum[];
  label: string;
  mount: AppExtensionMountEnum;
  url: string;
  open(): void;
}
export const extensionMountPoints = {
  PRODUCT_LIST: [
    AppExtensionMountEnum.PRODUCT_OVERVIEW_CREATE,
    AppExtensionMountEnum.PRODUCT_OVERVIEW_MORE_ACTIONS
  ],
  PRODUCT_DETAILS: [AppExtensionMountEnum.PRODUCT_DETAILS_MORE_ACTIONS],
  NAVIGATION_SIDEBAR: [
    AppExtensionMountEnum.NAVIGATION_CATALOG,
    AppExtensionMountEnum.NAVIGATION_CUSTOMERS,
    AppExtensionMountEnum.NAVIGATION_DISCOUNTS,
    AppExtensionMountEnum.NAVIGATION_ORDERS,
    AppExtensionMountEnum.NAVIGATION_PAGES,
    AppExtensionMountEnum.NAVIGATION_TRANSLATIONS
  ]
};

const filterAndMapToTarget = (
  extensions: ExtensionList_appExtensions_edges_node[],
  openApp: (appData: AppData) => void
): Extension[] =>
  extensions.map(
    ({ id, accessToken, permissions, url, label, mount, target, app }) => ({
      id,
      appId: app.id,
      accessToken,
      permissions: permissions.map(({ code }) => code),
      url,
      label,
      mount,
      open: () =>
        openApp({ id: app.id, appToken: accessToken, src: url, label, target })
    })
  );

export const mapToMenuItems = (extensions: Extension[]) =>
  extensions.map(({ label, id, open }) => ({
    label,
    testId: `extension-${id}`,
    onSelect: open
  }));

export const mapToExtensionsItems = (
  extensions: Extension[],
  header: FilterableMenuItem
) => {
  const items: FilterableMenuItem[] = extensions.map(
    ({ label, id, appId, url, permissions, open }) => ({
      ariaLabel: id,
      id: `extension-${id}`,
      label,
      url: appDeepUrl(appId, url),
      onClick: open,
      permissions
    })
  );
  if (items.length) {
    items.unshift(header);
  }
  return items;
};

export const getMenuItemExtension = (
  extensions: Record<AppExtensionMountEnum, Extension[]>,
  menuItem: SidebarMenuItem
) => {
  const extensionsList = Object.values(extensions).reduce(
    (list, extensions) => list.concat(extensions),
    []
  );
  const extension = extensionsList.find(
    extension => menuItem.id === `extension-${extension.id}`
  );
  return extension;
};

export const useExtensions = <T extends AppExtensionMountEnum>(
  mountList: T[]
): Record<T, Extension[]> => {
  const { openApp } = useExternalApp();

  const { data } = useExtensionList({
    fetchPolicy: "cache-first",
    variables: {
      filter: {
        mount: mountList
      }
    }
  });

  const extensions = filterAndMapToTarget(
    mapEdgesToItems(data?.appExtensions) || [],
    openApp
  );

  const extensionsMap = mountList.reduce(
    (extensionsMap, mount) => ({ ...extensionsMap, [mount]: [] }),
    {} as Record<T, Extension[]>
  );

  return extensions.reduce(
    (prevExtensionsMap, extension) => ({
      ...prevExtensionsMap,
      [extension.mount]: [
        ...(prevExtensionsMap[extension.mount] || []),
        extension
      ]
    }),
    extensionsMap
  );
};
