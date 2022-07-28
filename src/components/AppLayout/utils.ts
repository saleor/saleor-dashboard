import { getDashboardUrFromAppCompleteUrl } from "@saleor/apps/urls";
import { Extension } from "@saleor/apps/useExtensions";
import { AppExtensionMountEnum } from "@saleor/graphql";
import { SidebarMenuItem } from "@saleor/macaw-ui";
import { orderDraftListUrl, orderListUrl } from "@saleor/orders/urls";
import { matchPath } from "react-router";

import { FilterableMenuItem } from "./menuStructure";

export function isMenuActive(location: string, menuItem: SidebarMenuItem) {
  if (menuItem.children) {
    return menuItem.children.reduce(
      (acc, subMenuItem) => acc || isMenuActive(location, subMenuItem),
      false,
    );
  }

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

export const mapToExtensionsItems = (
  extensions: Extension[],
  header: FilterableMenuItem,
) => {
  const items: FilterableMenuItem[] = extensions.map(
    ({ label, id, app, url, permissions, open }) => ({
      ariaLabel: `app-${label}`,
      id: `extension-${id}`,
      label,
      url: getDashboardUrFromAppCompleteUrl(url, app.appUrl, app.id),
      onClick: open,
      permissions,
    }),
  );
  if (items.length) {
    items.unshift(header);
  }
  return items;
};

const isMenuItemExtension = (menuItem: SidebarMenuItem) =>
  menuItem.id.startsWith("extension-");

export const getMenuItemExtension = (
  extensions: Record<AppExtensionMountEnum, Extension[]>,
  menuItem: SidebarMenuItem,
) => {
  const extensionsList = Object.values(extensions).reduce(
    (list, extensions) => list.concat(extensions),
    [],
  );
  const extension = extensionsList.find(
    extension => menuItem.id === `extension-${extension.id}`,
  );
  return extension;
};
