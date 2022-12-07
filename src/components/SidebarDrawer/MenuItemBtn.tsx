import Typography from "@material-ui/core/Typography";
import React from "react";
import SVG from "react-inlinesvg";

import { CustomLinkComponent, SidebarMenuItem } from "../Sidebar/types";
import { getLinkComponent, getLinkProps } from "../Sidebar/utils";
import useStyles from "./styles";

export interface MenuItemBtnProps {
  menuItem: SidebarMenuItem;
  onClick: (menuItem: SidebarMenuItem) => void;
  linkComponent?: CustomLinkComponent;
}

export const MenuItemBtn: React.FC<MenuItemBtnProps> = ({
  menuItem,
  onClick,
  linkComponent,
}) => {
  const classes = useStyles();
  const linkProps = getLinkProps(menuItem);
  const Component = getLinkComponent(menuItem, linkComponent);

  return (
    <Component
      className={classes.menuItemBtn}
      data-test="menu-item-label"
      data-test-id={menuItem.id}
      onClick={() => onClick(menuItem)}
      {...linkProps}
    >
      {menuItem.iconSrc && (
        <SVG className={classes.icon} src={menuItem.iconSrc} />
      )}
      <Typography
        component="span"
        aria-label={menuItem.ariaLabel}
        className={classes.label}
      >
        {menuItem.label}
      </Typography>
    </Component>
  );
};

MenuItemBtn.displayName = "MenuItemBtn";
