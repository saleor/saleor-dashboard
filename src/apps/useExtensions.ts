import { FilterableMenuItem } from "@saleor/components/AppLayout/menuStructure";
import {
  AppExtensionMountEnum,
  PermissionEnum
} from "@saleor/types/globalTypes";
import { mapEdgesToItems } from "@saleor/utils/maps";

import { AppData, useExternalApp } from "./components/ExternalAppContext";
import { useExtensionList } from "./queries";
import { ExtensionList_appExtensions_edges_node } from "./types/ExtensionList";

interface Extension {
  id: string;
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
    ({ id, accessToken, permissions, url, label, mount, target }) => ({
      id,
      accessToken,
      permissions: permissions.map(({ code }) => code),
      url,
      label,
      mount,
      open: () =>
        openApp({ id, appToken: accessToken, src: url, label, target })
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
    ({ label, id, url, permissions }) => ({
      ariaLabel: id,
      id,
      label,
      url,
      permissions
    })
  );
  if (items.length) {
    items.unshift(header);
  }
  return items;
};

const useExtensionsItems = (
  mount: AppExtensionMountEnum,
  skip: (mount: AppExtensionMountEnum) => boolean,
  openApp: (appData: AppData) => void
) => {
  const { data } = useExtensionList({
    fetchPolicy: "cache-first",
    variables: {
      filter: {
        mount
      }
    },
    skip: skip(mount)
  });
  const extensions = mapEdgesToItems(data?.appExtensions) || [];
  return filterAndMapToTarget(extensions, openApp);
};

export const useExtensions = (
  mountList: AppExtensionMountEnum[]
): Record<AppExtensionMountEnum, Extension[]> => {
  const skip = (mount: AppExtensionMountEnum) => !mountList.includes(mount);

  const { openApp } = useExternalApp();

  const navigationCatalog = useExtensionsItems(
    AppExtensionMountEnum.NAVIGATION_CATALOG,
    skip,
    openApp
  );
  const navigationCustomers = useExtensionsItems(
    AppExtensionMountEnum.NAVIGATION_CUSTOMERS,
    skip,
    openApp
  );
  const navigationDiscounts = useExtensionsItems(
    AppExtensionMountEnum.NAVIGATION_DISCOUNTS,
    skip,
    openApp
  );
  const navigationOrders = useExtensionsItems(
    AppExtensionMountEnum.NAVIGATION_ORDERS,
    skip,
    openApp
  );
  const navigationPages = useExtensionsItems(
    AppExtensionMountEnum.NAVIGATION_PAGES,
    skip,
    openApp
  );
  const navigationTranslations = useExtensionsItems(
    AppExtensionMountEnum.NAVIGATION_TRANSLATIONS,
    skip,
    openApp
  );
  const productOverviewCreate = useExtensionsItems(
    AppExtensionMountEnum.PRODUCT_OVERVIEW_CREATE,
    skip,
    openApp
  );
  const productOverviewMoreActions = useExtensionsItems(
    AppExtensionMountEnum.PRODUCT_OVERVIEW_MORE_ACTIONS,
    skip,
    openApp
  );
  const productDetailsMoreActions = useExtensionsItems(
    AppExtensionMountEnum.PRODUCT_DETAILS_MORE_ACTIONS,
    skip,
    openApp
  );

  return {
    [AppExtensionMountEnum.NAVIGATION_CATALOG]: navigationCatalog,
    [AppExtensionMountEnum.NAVIGATION_CUSTOMERS]: navigationCustomers,
    [AppExtensionMountEnum.NAVIGATION_DISCOUNTS]: navigationDiscounts,
    [AppExtensionMountEnum.NAVIGATION_ORDERS]: navigationOrders,
    [AppExtensionMountEnum.NAVIGATION_PAGES]: navigationPages,
    [AppExtensionMountEnum.NAVIGATION_TRANSLATIONS]: navigationTranslations,
    [AppExtensionMountEnum.PRODUCT_OVERVIEW_CREATE]: productOverviewCreate,
    [AppExtensionMountEnum.PRODUCT_OVERVIEW_MORE_ACTIONS]: productOverviewMoreActions,
    [AppExtensionMountEnum.PRODUCT_DETAILS_MORE_ACTIONS]: productDetailsMoreActions
  };
};
