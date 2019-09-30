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
import React from "react";
import { FormattedMessage } from "react-intl";

import { CategoryFragment } from "@saleor/categories/types/CategoryFragment";
import Checkbox from "@saleor/components/Checkbox";
import Skeleton from "@saleor/components/Skeleton";
import TableHead from "@saleor/components/TableHead";
import TablePagination from "@saleor/components/TablePagination";
import { maybe, renderCollection } from "@saleor/misc";
import { ListActions, ListProps } from "@saleor/types";

const styles = (theme: Theme) =>
  createStyles({
    [theme.breakpoints.up("lg")]: {
      colName: {
        width: 840
      },
      colProducts: {
        width: 160
      },
      colSubcategories: {
        width: 160
      }
    },
    colName: {
      paddingLeft: 0
    },
    colProducts: {
      textAlign: "center"
    },
    colSubcategories: {
      textAlign: "center"
    },
    tableRow: {
      cursor: "pointer"
    }
  });

interface CategoryListProps extends ListProps, ListActions {
  categories?: CategoryFragment[];
  isRoot: boolean;
  onAdd?();
}

const numberOfColumns = 4;

const CategoryList = withStyles(styles, { name: "CategoryList" })(
  ({
    categories,
    classes,
    disabled,
    settings,
    pageInfo,
    isChecked,
    isRoot,
    selected,
    toggle,
    toggleAll,
    toolbar,
    onNextPage,
    onPreviousPage,
    onUpdateListSettings,
    onRowClick
  }: CategoryListProps & WithStyles<typeof styles>) => (
    <Table>
      <TableHead
        colSpan={numberOfColumns}
        selected={selected}
        disabled={disabled}
        items={categories}
        toggleAll={toggleAll}
        toolbar={toolbar}
      >
        <TableCell className={classes.colName}>
          <FormattedMessage defaultMessage="Category Name" />
        </TableCell>
        <TableCell className={classes.colSubcategories}>
          <FormattedMessage
            defaultMessage="Subcategories"
            description="number of subcategories"
          />
        </TableCell>
        <TableCell className={classes.colProducts}>
          <FormattedMessage
            defaultMessage="No. of Products"
            description="number of products"
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
          categories,
          category => {
            const isSelected = category ? isChecked(category.id) : false;

            return (
              <TableRow
                className={classes.tableRow}
                hover={!!category}
                onClick={category ? onRowClick(category.id) : undefined}
                key={category ? category.id : "skeleton"}
                selected={isSelected}
                data-tc="id"
                data-tc-id={maybe(() => category.id)}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={isSelected}
                    disabled={disabled}
                    disableClickPropagation
                    onChange={() => toggle(category.id)}
                  />
                </TableCell>
                <TableCell className={classes.colName} data-tc="name">
                  {category && category.name ? category.name : <Skeleton />}
                </TableCell>
                <TableCell className={classes.colSubcategories}>
                  {category &&
                  category.children &&
                  category.children.totalCount !== undefined ? (
                    category.children.totalCount
                  ) : (
                    <Skeleton />
                  )}
                </TableCell>
                <TableCell className={classes.colProducts}>
                  {category &&
                  category.products &&
                  category.products.totalCount !== undefined ? (
                    category.products.totalCount
                  ) : (
                    <Skeleton />
                  )}
                </TableCell>
              </TableRow>
            );
          },
          () => (
            <TableRow>
              <TableCell colSpan={numberOfColumns}>
                {isRoot ? (
                  <FormattedMessage defaultMessage="No categories found" />
                ) : (
                  <FormattedMessage defaultMessage="No subcategories found" />
                )}
              </TableCell>
            </TableRow>
          )
        )}
      </TableBody>
    </Table>
  )
);
CategoryList.displayName = "CategoryList";
export default CategoryList;
