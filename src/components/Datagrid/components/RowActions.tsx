import { IconButton, MoreHorizontalIcon } from "@saleor/macaw-ui";
import React from "react";

import CardMenu, { CardMenuItem } from "../../CardMenu";
import useStyles from "../styles";

interface RowActionsProps {
  menuItems: CardMenuItem[];
  disabled?: boolean;
}

export const RowActions = ({ menuItems, disabled }: RowActionsProps) => {
  const classes = useStyles();
  const hasSingleMenuItem = menuItems.length === 1;
  const firstMenuItem = menuItems[0];

  const handleIconClick = () => {
    firstMenuItem.onSelect();
  };

  if (!menuItems.length) {
    return null;
  }

  return (
    <div className={classes.rowAction}>
      {hasSingleMenuItem && firstMenuItem.Icon ? (
        <IconButton
          data-test-id="row-action-button"
          disabled={disabled}
          onClick={handleIconClick}
          className={classes.ghostIcon}
          variant="ghost"
        >
          {firstMenuItem.Icon}
        </IconButton>
      ) : (
        <CardMenu
          disabled={disabled}
          Icon={MoreHorizontalIcon}
          IconButtonProps={{
            className: classes.ghostIcon,
            hoverOutline: false,
            state: "default",
          }}
          menuItems={menuItems}
        />
      )}
    </div>
  );
};
