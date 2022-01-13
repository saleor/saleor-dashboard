import {
  AppExtensionTargetEnum,
  AppExtensionTypeEnum,
  AppExtensionViewEnum,
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
  url: string;
  open(): void;
}
type Target =
  | "create"
  | "moreActions"
  | "catalog"
  | "orders"
  | "customers"
  | "discounts"
  | "pages"
  | "translations";

const filterAndMapToTarget = (
  extensions: ExtensionList_appExtensions_edges_node[],
  target: AppExtensionTargetEnum,
  openApp: (appData: AppData) => void
): Extension[] =>
  extensions
    .filter(app => app.target === target)
    .map(({ id, accessToken, permissions, url, label, openAs }) => ({
      id,
      accessToken,
      permissions: permissions.map(({ code }) => code),
      url,
      label,
      open: () => openApp({ appToken: accessToken, src: url, label, openAs })
    }));

export const mapToMenuItems = (extensions: Extension[]) =>
  extensions.map(({ label, id, open }) => ({
    label,
    testId: `extension-${id}`,
    onSelect: open
  }));

export const mapToSidebarMenuItems = (extensions: Extension[]) =>
  extensions.map(({ label, id, url, permissions }) => ({
    ariaLabel: id,
    id,
    label,
    url,
    permissions
  }));

export const useExtensions = (
  view: AppExtensionViewEnum,
  type: AppExtensionTypeEnum
): Record<Target, Extension[]> => {
  const { openApp } = useExternalApp();
  const { data } = useExtensionList({
    fetchPolicy: "cache-first",
    variables: {
      filter: {
        view,
        type
      }
    }
  });
  const extensions = mapEdgesToItems(data?.appExtensions) || [];

  const targetCreate = filterAndMapToTarget(
    extensions,
    AppExtensionTargetEnum.CREATE,
    openApp
  );
  const targetMoreActions = filterAndMapToTarget(
    extensions,
    AppExtensionTargetEnum.MORE_ACTIONS,
    openApp
  );
  const targetCatalog = filterAndMapToTarget(
    extensions,
    AppExtensionTargetEnum.CATALOG,
    openApp
  );
  const targetOrders = filterAndMapToTarget(
    extensions,
    AppExtensionTargetEnum.ORDERS,
    openApp
  );
  const targetCustomers = filterAndMapToTarget(
    extensions,
    AppExtensionTargetEnum.CUSTOMERS,
    openApp
  );
  const targetDiscounts = filterAndMapToTarget(
    extensions,
    AppExtensionTargetEnum.DISCOUNTS,
    openApp
  );
  const targetPages = filterAndMapToTarget(
    extensions,
    AppExtensionTargetEnum.PAGES,
    openApp
  );
  const targetTranslations = filterAndMapToTarget(
    extensions,
    AppExtensionTargetEnum.TRANSLATIONS,
    openApp
  );

  return {
    create: targetCreate,
    moreActions: targetMoreActions,
    catalog: targetCatalog,
    orders: targetOrders,
    customers: targetCustomers,
    discounts: targetDiscounts,
    pages: targetPages,
    translations: targetTranslations
  };
};
