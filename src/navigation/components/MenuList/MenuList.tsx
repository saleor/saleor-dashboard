import Card from "@material-ui/core/Card";
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableFooter from "@material-ui/core/TableFooter";
import TableRow from "@material-ui/core/TableRow";
import DeleteIcon from "@material-ui/icons/Delete";
import React from "react";
import { FormattedMessage } from "react-intl";

import Checkbox from "@saleor/components/Checkbox";
import IconButtonTableCell from "@saleor/components/IconButtonTableCell";
import Skeleton from "@saleor/components/Skeleton";
import TableHead from "@saleor/components/TableHead";
import TablePagination from "@saleor/components/TablePagination";
import { maybe, renderCollection } from "@saleor/misc";
import { ListActions, ListProps } from "@saleor/types";
import { MenuList_menus_edges_node } from "../../types/MenuList";

export interface MenuListProps extends ListProps, ListActions {
  menus: MenuList_menus_edges_node[];
  onDelete: (id: string) => void;
}

const styles = (theme: Theme) =>
  createStyles({
    [theme.breakpoints.up("lg")]: {
      colItems: {
        width: 200
      },
      colTitle: {}
    },
    colItems: {
      textAlign: "right"
    },
    colTitle: {},
    row: {
      cursor: "pointer"
    }
  });

const numberOfColumns = 4;

const MenuList = withStyles(styles, { name: "MenuList" })(
  ({
    classes,
    settings,
    disabled,
    isChecked,
    menus,
    onDelete,
    onNextPage,
    onPreviousPage,
    onUpdateListSettings,
    onRowClick,
    pageInfo,
    selected,
    toggle,
    toggleAll,
    toolbar
  }: MenuListProps & WithStyles<typeof styles>) => (
    <Card>
      <Table>
        <TableHead
          colSpan={numberOfColumns}
          selected={selected}
          disabled={disabled}
          items={menus}
          toggleAll={toggleAll}
          toolbar={toolbar}
        >
          <TableCell className={classes.colTitle}>
            <FormattedMessage
              defaultMessage="Menu Title"
              id="menuListMenutitle"
            />
          </TableCell>
          <TableCell className={classes.colItems}>
            <FormattedMessage
              defaultMessage="Items"
              description="number of menu items"
              id="menuListItems"
            />
          </TableCell>
        </TableHead>
        <TableFooter>
          <TableRow>
            <TablePagination
              colSpan={numberOfColumns}
              settings={settings}
              hasNextPage={pageInfo && !disabled ? pageInfo.hasNextPage : false}
              onNextPage={onNextPage}
              onUpdateListSettings={onUpdateListSettings}
              hasPreviousPage={
                pageInfo && !disabled ? pageInfo.hasPreviousPage : false
              }
              onPreviousPage={onPreviousPage}
            />
          </TableRow>
        </TableFooter>
        <TableBody>
          {renderCollection(
            menus,
            menu => {
              const isSelected = menu ? isChecked(menu.id) : false;

              return (
                <TableRow
                  hover={!!menu}
                  key={menu ? menu.id : "skeleton"}
                  onClick={menu && onRowClick(menu.id)}
                  className={classes.row}
                  selected={isSelected}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isSelected}
                      disabled={disabled}
                      disableClickPropagation
                      onChange={() => toggle(menu.id)}
                    />
                  </TableCell>
                  <TableCell className={classes.colTitle}>
                    {maybe<React.ReactNode>(() => menu.name, <Skeleton />)}
                  </TableCell>
                  <TableCell className={classes.colItems}>
                    {maybe<React.ReactNode>(
                      () => menu.items.length,
                      <Skeleton />
                    )}
                  </TableCell>
                  <IconButtonTableCell
                    disabled={disabled}
                    onClick={() => onDelete(menu.id)}
                  >
                    <DeleteIcon />
                  </IconButtonTableCell>
                </TableRow>
              );
            },
            () => (
              <TableRow>
                <TableCell colSpan={numberOfColumns}>
                  <FormattedMessage
                    defaultMessage="No menus found"
                    id="menuListNoMenus"
                  />
                </TableCell>
              </TableRow>
            )
          )}
        </TableBody>
      </Table>
    </Card>
  )
);
MenuList.displayName = "MenuList";
export default MenuList;
