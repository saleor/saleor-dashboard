import { isUrlAbsolute } from "@dashboard/extensions/isUrlAbsolute";
import { type Extension } from "@dashboard/extensions/types";
import { ExtensionsUrls } from "@dashboard/extensions/urls";
import { orderDraftListUrl, orderDraftPath, orderListUrl, orderPath } from "@dashboard/orders/urls";
import { matchPath } from "react-router";

import { type SidebarMenuItem } from "./types";

const ORDER_RESERVED_PATH_SEGMENTS = ["drafts", "settings"];

const getOrderDetailId = (activeUrl: string): string | null => {
  const match = matchPath<{ orderId: string }>(activeUrl, {
    path: orderPath(":orderId"),
    exact: true,
  });

  if (!match?.params.orderId) {
    return null;
  }

  const orderId = decodeURIComponent(match.params.orderId);

  if (ORDER_RESERVED_PATH_SEGMENTS.includes(orderId)) {
    return null;
  }

  return orderId;
};

const getOrderDraftDetailId = (activeUrl: string): string | null => {
  const match = matchPath<{ id: string }>(activeUrl, {
    path: orderDraftPath(":id"),
    exact: true,
  });

  if (!match?.params.id) {
    return null;
  }

  return decodeURIComponent(match.params.id);
};

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

  const orderDraftListPath = orderDraftListUrl().split("?")[0];
  const orderListPath = orderListUrl().split("?")[0];
  const isDraftOrderDetailPage = getOrderDraftDetailId(activeUrl) !== null;
  const isOrderDetailPage = getOrderDetailId(activeUrl) !== null;

  if (
    menuUrlsToCheck.some(url => url === orderListPath) &&
    (activeUrl === orderDraftListPath || isDraftOrderDetailPage)
  ) {
    return false;
  }

  if (
    menuUrlsToCheck.some(url => url === orderDraftListPath) &&
    (activeUrl === orderDraftListPath || isDraftOrderDetailPage)
  ) {
    return true;
  }

  if (
    menuUrlsToCheck.some(url => url === orderDraftListPath) &&
    isOrderDetailPage &&
    !isDraftOrderDetailPage
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
