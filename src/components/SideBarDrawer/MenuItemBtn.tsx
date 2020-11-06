import Typography from "@material-ui/core/Typography";
import { UseNavigatorResult } from "@saleor/hooks/useNavigator";
import React from "react";
import SVG from "react-inlinesvg";

import { IMenuItem } from "../AppLayout/menuStructure";
import useStyles from "./styles";

export interface MenuItemBtnProps {
  menuItem: IMenuItem;
  onClick: UseNavigatorResult;
}
const MenuItemBtn: React.FC<MenuItemBtnProps> = ({ menuItem, onClick }) => {
  const classes = useStyles({});

  return (
    <button
      className={classes.menuItemBtn}
      data-test="menu-item-label"
      data-test-id={menuItem.testingContextId}
      onClick={() => onClick(menuItem.url)}
    >
      {menuItem.icon && <SVG className={classes.icon} src={menuItem.icon} />}
      <Typography aria-label={menuItem.ariaLabel} className={classes.label}>
        {menuItem.label}
      </Typography>
    </button>
  );
};

MenuItemBtn.displayName = "MenuItemBtn";
export default MenuItemBtn;
