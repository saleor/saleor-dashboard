import { isUrlAbsolute } from "@dashboard/extensions/isUrlAbsolute";
import { type Extension } from "@dashboard/extensions/types";
import { ExtensionsUrls } from "@dashboard/extensions/urls";
import { orderDraftListUrl, orderListUrl } from "@dashboard/orders/urls";
import { matchPath } from "react-router";

import { type SidebarMenuItem } from "./types";

const resolveExtensionMenuUrl = (extension: Extension): string | undefined => {
  if (isUrlAbsolute(extension.url) || !extension.app.appUrl) {
    return undefined;
  }

  return ExtensionsUrls.resolveDashboardUrlFromAppCompleteUrl(
    extension.url,
    extension.app.appUrl,
    extension.app.id,
  );
};

export const mapToExtensionsItems = (extensions: Extension[], header: SidebarMenuItem) => {
  const items: SidebarMenuItem[] = extensions.map(extension => ({
    id: `extension-${extension.id}`,
    label: extension.label,
    url: resolveExtensionMenuUrl(extension),
    permissions: extension.permissions,
    onClick: extension.open,
    type: "item",
  }));

  if (items.length) {
    items.unshift(header);
  }

  return items;
};

export function isMenuActive(location: string, menuItem: SidebarMenuItem) {
  const menuUrlsToCheck = [...(menuItem.matchUrls || []), menuItem.url]
    .filter((item): item is string => Boolean(item))
    .map(item => item.split("?")[0]);

  if (menuUrlsToCheck.length === 0) {
    return false;
  }

  const activeUrl = getPureUrl(location.split("?")[0]);

  if (isMenuItemExtension(menuItem)) {
    return false;
  }

  if (
    activeUrl === orderDraftListUrl().split("?")[0] &&
    menuUrlsToCheck.some(url => url === orderListUrl().split("?")[0])
  ) {
    return false;
  }

  return menuUrlsToCheck.some(menuItemUrl => {
    return !!matchPath(activeUrl, {
      exact: menuItemUrl === "/",
      path: menuItemUrl,
    });
  });
}

const getPureUrl = (url: string) => {
  if (url.includes("/dashboard")) {
    return url.split("/dashboard")[1];
  }

  return url;
};
const isMenuItemExtension = (menuItem: SidebarMenuItem) => menuItem.id.startsWith("extension-");

export const getMenuItemExtension = (
  extensions: Record<
    | "NAVIGATION_CATALOG"
    | "NAVIGATION_ORDERS"
    | "NAVIGATION_CUSTOMERS"
    | "NAVIGATION_DISCOUNTS"
    | "NAVIGATION_TRANSLATIONS"
    | "NAVIGATION_PAGES",
    Extension[]
  >,
  id: string,
) => {
  const extensionsList = Object.values(extensions).reduce(
    (list, extensions) => list.concat(extensions),
    [],
  );
  const extension = extensionsList.find(extension => id === `extension-${extension.id}`);

  return extension;
};
