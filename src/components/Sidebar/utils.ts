import { CustomLinkComponent, SidebarMenuItem } from "./types";

export const getLinkProps = (menuItem: SidebarMenuItem) => {
  if (menuItem.external) {
    return { href: menuItem.url, target: "_blank" };
  }
  if (menuItem.url) {
    return {
      href: menuItem.url,
    };
  }
  return {};
};

export const getLinkComponent = (
  menuItem: SidebarMenuItem,
  customComponent?: CustomLinkComponent,
) => {
  if (menuItem.external) {
    return "a";
  }
  return customComponent ?? "button";
};
