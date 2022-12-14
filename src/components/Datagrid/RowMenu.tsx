import { MoreHorizontalIcon } from "@saleor/macaw-ui";
import clsx from "clsx";
import React from "react";

import CardMenu, { CardMenuItem } from "../CardMenu";
import useStyles from "./styles";

interface RowMenuProps {
  menuItems: CardMenuItem[];
  scrolledToRight: boolean;
  isRowSelected: boolean;
  disabled?: boolean;
}

const RowMenu = ({
  menuItems,
  scrolledToRight,
  isRowSelected,
  disabled,
}: RowMenuProps) => {
  const classes = useStyles();
  const isEditOnlyItem =
    menuItems.length === 1 &&
    menuItems[0].label.toLocaleLowerCase().includes("edit");

  return (
    <div
      className={clsx(classes.rowAction, {
        [classes.rowActionSelected]: isRowSelected,
        [classes.rowActionScrolledToRight]: scrolledToRight,
      })}
    >
      {isEditOnlyItem ? (
        <div>tes</div>
      ) : (
        <CardMenu
          disabled={disabled}
          Icon={MoreHorizontalIcon}
          IconButtonProps={{
            className: classes.columnPickerBtn,
            hoverOutline: false,
            state: "default",
          }}
          menuItems={menuItems}
        />
      )}
    </div>
  );
};

export { RowMenu };
