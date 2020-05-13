import { makeStyles } from "@material-ui/core/styles";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableFooter from "@material-ui/core/TableFooter";
import TableRow from "@material-ui/core/TableRow";
import Checkbox from "@saleor/components/Checkbox";
import Money from "@saleor/components/Money";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import Skeleton from "@saleor/components/Skeleton";
import StatusLabel from "@saleor/components/StatusLabel";
import TableCellAvatar, {
  AVATAR_MARGIN
} from "@saleor/components/TableCellAvatar";
import TableHead from "@saleor/components/TableHead";
import TablePagination from "@saleor/components/TablePagination";
import { maybe, renderCollection } from "@saleor/misc";
import { ListActions, ListProps } from "@saleor/types";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { CategoryDetails_category_products_edges_node } from "../../types/CategoryDetails";

const useStyles = makeStyles(
  theme => ({
    [theme.breakpoints.up("lg")]: {
      colName: {
        width: "auto"
      },
      colPrice: {
        width: 200
      },
      colPublished: {
        width: 200
      },
      colType: {
        width: 200
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
    colPrice: {
      textAlign: "right"
    },
    colPublished: {},
    colType: {},
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
  products: CategoryDetails_category_products_edges_node[];
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
  const intl = useIntl();

  const numberOfColumns = 5;

  return (
    <div className={classes.tableContainer}>
      <ResponsiveTable className={classes.table}>
        <colgroup>
          <col />
          <col className={classes.colName} />
          <col className={classes.colType} />
          <col className={classes.colPublished} />
          <col className={classes.colPrice} />
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
              <FormattedMessage defaultMessage="Name" description="product" />
            </span>
          </TableCell>
          <TableCell className={classes.colType}>
            <FormattedMessage
              defaultMessage="Type"
              description="product type"
            />
          </TableCell>
          <TableCell className={classes.colPublished}>
            <FormattedMessage
              defaultMessage="Published"
              description="product status"
            />
          </TableCell>
          <TableCell className={classes.colPrice}>
            <FormattedMessage
              defaultMessage="Price"
              description="product price"
            />
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
                  <TableCell className={classes.colType}>
                    {product && product.productType ? (
                      product.productType.name
                    ) : (
                      <Skeleton />
                    )}
                  </TableCell>
                  <TableCell className={classes.colPublished}>
                    {product &&
                    maybe(() => product.isAvailable !== undefined) ? (
                      <StatusLabel
                        label={
                          product.isAvailable
                            ? intl.formatMessage({
                                defaultMessage: "Published",
                                description: "product",
                                id: "productStatusLabel"
                              })
                            : intl.formatMessage({
                                defaultMessage: "Not published",
                                description: "product"
                              })
                        }
                        status={product.isAvailable ? "success" : "error"}
                      />
                    ) : (
                      <Skeleton />
                    )}
                  </TableCell>
                  <TableCell className={classes.colPrice}>
                    {maybe(() => product.basePrice) &&
                    maybe(() => product.basePrice.amount) !== undefined &&
                    maybe(() => product.basePrice.currency) !== undefined ? (
                      <Money money={product.basePrice} />
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
                  <FormattedMessage defaultMessage="No products found" />
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
