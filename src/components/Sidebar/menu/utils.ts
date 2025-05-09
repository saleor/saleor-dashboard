// @ts-strict-ignore
import { AppUrls } from "@dashboard/apps/urls";
import { Extension } from "@dashboard/extensions/hooks/useExtensions";
import { ExtensionsUrls } from "@dashboard/extensions/urls";
import { AppExtensionMountEnum } from "@dashboard/graphql";
import { orderDraftListUrl, orderListUrl } from "@dashboard/orders/urls";
import { matchPath } from "react-router";

import { SidebarMenuItem } from "./types";

// TODO: Remove newExtensionsFlag once "extensions" feature flag is removed
export const mapToExtensionsItems = (
  extensions: Extension[],
  header: SidebarMenuItem,
  newExtensionsFlag: boolean,
) => {
  const items: SidebarMenuItem[] = extensions.map(({ label, id, app, url, permissions, open }) => ({
    id: `extension-${id}`,
    label,
    url: newExtensionsFlag
      ? ExtensionsUrls.resolveDashboardUrlFromAppCompleteUrl(url, app.appUrl, app.id)
      : AppUrls.resolveDashboardUrlFromAppCompleteUrl(url, app.appUrl, app.id),
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

  const activeUrl = getPureUrl(location.split("?")[0]);
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

  // TODO: Temporary workaround, remove when extension are finished.
  const isInstalledExtension = activeUrl.includes("/custom/") || activeUrl.includes("/apps/");

  if (menuItem.id === "installed-extensions" && isInstalledExtension) {
    return true;
  }

  return !!matchPath(activeUrl, {
    exact: menuItemUrl === "/",
    path: menuItemUrl,
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
