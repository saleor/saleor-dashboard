// @ts-strict-ignore
import Checkbox from "@dashboard/components/Checkbox";
import IconButtonTableCell from "@dashboard/components/IconButtonTableCell";
import ResponsiveTable from "@dashboard/components/ResponsiveTable";
import Skeleton from "@dashboard/components/Skeleton";
import { TableButtonWrapper } from "@dashboard/components/TableButtonWrapper/TableButtonWrapper";
import TableCellHeader from "@dashboard/components/TableCellHeader";
import TableHead from "@dashboard/components/TableHead";
import { TablePaginationWithContext } from "@dashboard/components/TablePagination";
import TableRowLink from "@dashboard/components/TableRowLink";
import { MenuFragment } from "@dashboard/graphql";
import { maybe, renderCollection } from "@dashboard/misc";
import { MenuListUrlSortField, menuUrl } from "@dashboard/navigation/urls";
import { ListActions, ListProps, SortPage } from "@dashboard/types";
import { getArrowDirection } from "@dashboard/utils/sort";
import { Card, TableBody, TableCell, TableFooter } from "@material-ui/core";
import { DeleteIcon, makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage } from "react-intl";

export interface MenuListProps extends ListProps, ListActions, SortPage<MenuListUrlSortField> {
  menus: MenuFragment[];
  onDelete: (id: string) => void;
}

const useStyles = makeStyles(
  theme => ({
    [theme.breakpoints.up("lg")]: {
      colItems: {
        width: 200,
      },
      colTitle: {},
    },
    colAction: {
      width: 84,
    },
    colItems: {
      textAlign: "right",
    },
    colTitle: {
      paddingLeft: 0,
    },
    row: {
      cursor: "pointer",
    },
  }),
  { name: "MenuList" },
);
const numberOfColumns = 4;
const MenuList: React.FC<MenuListProps> = props => {
  const {
    settings,
    disabled,
    isChecked,
    menus,
    onDelete,
    onUpdateListSettings,
    onSort,
    selected,
    sort,
    toggle,
    toggleAll,
    toolbar,
  } = props;
  const classes = useStyles(props);

  return (
    <Card>
      <ResponsiveTable>
        <TableHead
          colSpan={numberOfColumns}
          selected={selected}
          disabled={disabled}
          items={menus}
          toggleAll={toggleAll}
          toolbar={toolbar}
        >
          <TableCellHeader
            direction={
              sort.sort === MenuListUrlSortField.name ? getArrowDirection(sort.asc) : undefined
            }
            arrowPosition="right"
            onClick={() => onSort(MenuListUrlSortField.name)}
            className={classes.colTitle}
          >
            <FormattedMessage id="jhh/D6" defaultMessage="Menu Title" />
          </TableCellHeader>
          <TableCellHeader
            direction={
              sort.sort === MenuListUrlSortField.items ? getArrowDirection(sort.asc) : undefined
            }
            textAlign="right"
            onClick={() => onSort(MenuListUrlSortField.items)}
            className={classes.colItems}
          >
            <FormattedMessage
              id="0nL1D6"
              defaultMessage="Items"
              description="number of menu items"
            />
          </TableCellHeader>
          <TableCell className={classes.colAction} />
        </TableHead>
        <TableFooter>
          <TableRowLink>
            <TablePaginationWithContext
              colSpan={numberOfColumns}
              settings={settings}
              onUpdateListSettings={onUpdateListSettings}
            />
          </TableRowLink>
        </TableFooter>
        <TableBody data-test-id="navigation-menu-list">
          {renderCollection(
            menus,
            menu => {
              const isSelected = menu ? isChecked(menu.id) : false;

              return (
                <TableRowLink
                  data-test-id="navigation-menu"
                  hover={!!menu}
                  key={menu ? menu.id : "skeleton"}
                  href={menu && menuUrl(menu.id)}
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
                  <TableCell className={classes.colTitle} data-test-id="menu-name">
                    {maybe<React.ReactNode>(() => menu.name, <Skeleton />)}
                  </TableCell>
                  <TableCell className={classes.colItems}>
                    {maybe<React.ReactNode>(() => menu.items.length, <Skeleton />)}
                  </TableCell>
                  <TableButtonWrapper>
                    <IconButtonTableCell
                      className={classes.colAction}
                      disabled={disabled}
                      onClick={() => onDelete(menu.id)}
                    >
                      <DeleteIcon />
                    </IconButtonTableCell>
                  </TableButtonWrapper>
                </TableRowLink>
              );
            },
            () => (
              <TableRowLink>
                <TableCell colSpan={numberOfColumns}>
                  <FormattedMessage id="DWs4ba" defaultMessage="No menus found" />
                </TableCell>
              </TableRowLink>
            ),
          )}
        </TableBody>
      </ResponsiveTable>
    </Card>
  );
};

MenuList.displayName = "MenuList";
export default MenuList;
