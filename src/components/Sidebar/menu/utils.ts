import { getDashboardUrFromAppCompleteUrl } from "@dashboard/apps/urls";
import { Extension } from "@dashboard/apps/useExtensions";
import { AppExtensionMountEnum } from "@dashboard/graphql";
import { orderDraftListUrl, orderListUrl } from "@dashboard/orders/urls";
import { matchPath } from "react-router";

import { SidebarMenuItem } from "./types";

export const mapToExtensionsItems = (extensions: Extension[], header: SidebarMenuItem) => {
  const items: SidebarMenuItem[] = extensions.map(({ label, id, app, url, permissions, open }) => ({
    id: `extension-${id}`,
    label,
    url: getDashboardUrFromAppCompleteUrl(url, app.appUrl, app.id),
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
  if (!menuItem.url) {
    return false;
  }

  const activeUrl = location.split("?")[0];
  const menuItemUrl = menuItem.url.split("?")[0];

  if (isMenuItemExtension(menuItem)) {
    return false;
  }

  if (
    activeUrl === orderDraftListUrl().split("?")[0] &&
    menuItemUrl === orderListUrl().split("?")[0]
  ) {
    return false;
  }

  return !!matchPath(activeUrl, {
    exact: menuItemUrl === "/",
    path: menuItemUrl,
  });
}

const isMenuItemExtension = (menuItem: SidebarMenuItem) => menuItem.id.startsWith("extension-");

export const getMenuItemExtension = (
  extensions: Record<AppExtensionMountEnum, Extension[]>,
  id: string,
) => {
  const extensionsList = Object.values(extensions).reduce(
    (list, extensions) => list.concat(extensions),
    [],
  );
  const extension = extensionsList.find(extension => id === `extension-${extension.id}`);
  return extension;
};
