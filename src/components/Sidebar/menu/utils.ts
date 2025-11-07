// @ts-strict-ignore
import { Extension } from "@dashboard/extensions/types";
import { ExtensionsUrls } from "@dashboard/extensions/urls";
import { orderDraftListUrl, orderListUrl } from "@dashboard/orders/urls";
import { matchPath } from "react-router";

import { SidebarMenuItem } from "./types";

export const mapToExtensionsItems = (extensions: Extension[], header: SidebarMenuItem) => {
  const items: SidebarMenuItem[] = extensions.map(({ label, id, app, url, permissions, open }) => ({
    id: `extension-${id}`,
    label,
    url: ExtensionsUrls.resolveDashboardUrlFromAppCompleteUrl(url, app.appUrl, app.id),
    permissions,
    onClick: open,
    type: "item",
  }));

  if (items.length) {
    items.unshift(header);
  }

  return items;
};

export function isMenuActive(location: string, menuItem: SidebarMenuItem) {
  const menuUrlsToCheck = [...(menuItem.matchUrls || []), menuItem.url]
    .filter(Boolean)
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
