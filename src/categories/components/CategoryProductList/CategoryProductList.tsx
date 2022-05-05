import { TableBody, TableCell, TableFooter, TableRow } from "@material-ui/core";
import Checkbox from "@saleor/components/Checkbox";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import Skeleton from "@saleor/components/Skeleton";
import TableCellAvatar from "@saleor/components/TableCellAvatar";
import { AVATAR_MARGIN } from "@saleor/components/TableCellAvatar/Avatar";
import TableHead from "@saleor/components/TableHead";
import TablePagination from "@saleor/components/TablePagination";
import { CategoryDetailsQuery } from "@saleor/graphql";
import { makeStyles } from "@saleor/macaw-ui";
import { maybe, renderCollection } from "@saleor/misc";
import { ListActions, ListProps, RelayToFlat } from "@saleor/types";
import React from "react";
import { FormattedMessage } from "react-intl";

const useStyles = makeStyles(
  theme => ({
    [theme.breakpoints.up("lg")]: {
      colName: {
        width: "auto"
      }
    },
    colFill: {
      padding: 0,
      width: "100%"
    },
    colName: {},
    colNameHeader: {
      marginLeft: AVATAR_MARGIN
    },
    link: {
      cursor: "pointer"
    },
    table: {
      tableLayout: "fixed"
    },
    tableContainer: {
      overflowX: "scroll"
    },
    textLeft: {
      textAlign: "left"
    },
    textRight: {
      textAlign: "right"
    }
  }),
  {
    name: "CategoryProductList"
  }
);

interface CategoryProductListProps extends ListProps, ListActions {
  products: RelayToFlat<CategoryDetailsQuery["category"]["products"]>;
}

export const CategoryProductList: React.FC<CategoryProductListProps> = props => {
  const {
    disabled,
    isChecked,
    pageInfo,
    products,
    selected,
    toggle,
    toggleAll,
    toolbar,
    onNextPage,
    onPreviousPage,
    onRowClick
  } = props;

  const classes = useStyles(props);

  const numberOfColumns = 2;

  return (
    <div className={classes.tableContainer}>
      <ResponsiveTable className={classes.table}>
        <colgroup>
          <col />
          <col className={classes.colName} />
        </colgroup>
        <TableHead
          colSpan={numberOfColumns}
          selected={selected}
          disabled={disabled}
          items={products}
          toggleAll={toggleAll}
          toolbar={toolbar}
        >
          <TableCell className={classes.colName}>
            <span className={classes.colNameHeader}>
              <FormattedMessage
                id="VQLIXd"
                defaultMessage="Name"
                description="product"
              />
            </span>
          </TableCell>
        </TableHead>
        <TableFooter>
          <TableRow>
            <TablePagination
              colSpan={numberOfColumns}
              hasNextPage={pageInfo && !disabled ? pageInfo.hasNextPage : false}
              onNextPage={onNextPage}
              hasPreviousPage={
                pageInfo && !disabled ? pageInfo.hasPreviousPage : false
              }
              onPreviousPage={onPreviousPage}
            />
          </TableRow>
        </TableFooter>
        <TableBody>
          {renderCollection(
            products,
            product => {
              const isSelected = product ? isChecked(product.id) : false;

              return (
                <TableRow
                  data-test-id="product-row"
                  selected={isSelected}
                  hover={!!product}
                  key={product ? product.id : "skeleton"}
                  onClick={product && onRowClick(product.id)}
                  className={classes.link}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isSelected}
                      disabled={disabled}
                      disableClickPropagation
                      onChange={() => toggle(product.id)}
                    />
                  </TableCell>
                  <TableCellAvatar
                    className={classes.colName}
                    thumbnail={maybe(() => product.thumbnail.url)}
                  >
                    {product ? product.name : <Skeleton />}
                  </TableCellAvatar>
                </TableRow>
              );
            },
            () => (
              <TableRow>
                <TableCell colSpan={numberOfColumns}>
                  <FormattedMessage
                    id="Q1Uzbb"
                    defaultMessage="No products found"
                  />
                </TableCell>
              </TableRow>
            )
          )}
        </TableBody>
      </ResponsiveTable>
    </div>
  );
};

CategoryProductList.displayName = "CategoryProductList";
export default CategoryProductList;
