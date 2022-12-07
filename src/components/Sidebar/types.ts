import React from "react";

export interface SidebarMenuItem {
  label: string;
  id: string;
  ariaLabel?: string;
  children?: SidebarMenuItem[];
  iconSrc?: string;
  url?: string;
  external?: boolean;
  onClick?: () => void;
}

export type CustomLinkComponent = React.ForwardRefExoticComponent<{
  href?: string;
  onClick?: (...params: any) => void;
  className?: string;
}>;

export interface BaseSidebarProps {
  className?: string;
  menuItems: SidebarMenuItem[];
  toolbar?: React.ReactNode;
  onMenuItemClick: (menuItem: SidebarMenuItem) => void;
  linkComponent?: CustomLinkComponent;
  logoHref?: string;
}
