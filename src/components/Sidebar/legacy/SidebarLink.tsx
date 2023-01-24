import React from "react";
import { Link, LinkProps } from "react-router-dom";

interface SidebarLinkProps extends Omit<LinkProps, "to"> {
  href?: string;
}

export const SidebarLink = React.forwardRef<
  HTMLAnchorElement,
  SidebarLinkProps
>(({ href, ...props }, ref) => <Link to={href} {...props} innerRef={ref} />);

SidebarLink.displayName = "SidebarLink";
