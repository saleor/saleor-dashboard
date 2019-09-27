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
import classNames from "classnames";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import TableCellAvatar, {
  AVATAR_MARGIN
} from "@saleor/components/TableCellAvatar";
import { ProductListColumns } from "@saleor/config";
import { maybe, renderCollection } from "@saleor/misc";
import {
  getAttributeIdFromColumnValue,
  isAttributeColumnValue
} from "@saleor/products/components/ProductListPage/utils";
import { AvailableInGridAttributes_grid_edges_node } from "@saleor/products/types/AvailableInGridAttributes";
import { ProductList_products_edges_node } from "@saleor/products/types/ProductList";
import { ListActions, ListProps } from "@saleor/types";
import TDisplayColumn from "@saleor/utils/columns/DisplayColumn";
import Checkbox from "../Checkbox";
import Money from "../Money";
import Skeleton from "../Skeleton";
import StatusLabel from "../StatusLabel";
import TableHead from "../TableHead";
import TablePagination from "../TablePagination";

const styles = (theme: Theme) =>
  createStyles({
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
    colAttribute: {
      width: 150
    },
    colFill: {
      padding: 0,
      width: "100%"
    },
    colName: {
      "&$colNameFixed": {
        width: 250
      },
      paddingLeft: 0
    },
    colNameFixed: {},
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
  });

interface ProductListProps
  extends ListProps<ProductListColumns>,
    ListActions,
    WithStyles<typeof styles> {
  gridAttributes: AvailableInGridAttributes_grid_edges_node[];
  products: ProductList_products_edges_node[];
}

export const ProductList = withStyles(styles, { name: "ProductList" })(
  ({
    classes,
    settings,
    disabled,
    isChecked,
    gridAttributes,
    pageInfo,
    products,
    selected,
    toggle,
    toggleAll,
    toolbar,
    onNextPage,
    onPreviousPage,
    onUpdateListSettings,
    onRowClick
  }: ProductListProps) => {
    const intl = useIntl();

    const DisplayColumn: React.FC<{ column: ProductListColumns }> = props => (
      <TDisplayColumn displayColumns={settings.columns} {...props} />
    );

    const gridAttributesFromSettings = settings.columns.filter(
      isAttributeColumnValue
    );
    const numberOfColumns = 2 + settings.columns.length;

    return (
      <div className={classes.tableContainer}>
        <Table className={classes.table}>
          <colgroup>
            <col />
            <col className={classes.colName} />
            <DisplayColumn column="productType">
              <col className={classes.colType} />
            </DisplayColumn>
            <DisplayColumn column="isPublished">
              <col className={classes.colPublished} />
            </DisplayColumn>
            {gridAttributesFromSettings.map(gridAttribute => (
              <col className={classes.colAttribute} key={gridAttribute} />
            ))}
            <DisplayColumn column="price">
              <col className={classes.colPrice} />
            </DisplayColumn>
          </colgroup>
          <TableHead
            colSpan={numberOfColumns}
            selected={selected}
            disabled={disabled}
            items={products}
            toggleAll={toggleAll}
            toolbar={toolbar}
          >
            <TableCell
              className={classNames(classes.colName, {
                [classes.colNameFixed]: settings.columns.length > 4
              })}
            >
              <span className={classes.colNameHeader}>
                <FormattedMessage defaultMessage="Name" description="product" />
              </span>
            </TableCell>
            <DisplayColumn column="productType">
              <TableCell className={classes.colType}>
                <FormattedMessage defaultMessage="Type" description="product" />
              </TableCell>
            </DisplayColumn>
            <DisplayColumn column="isPublished">
              <TableCell className={classes.colPublished}>
                <FormattedMessage
                  defaultMessage="Published"
                  description="product status"
                />
              </TableCell>
            </DisplayColumn>
            {gridAttributesFromSettings.map(gridAttributeFromSettings => (
              <TableCell
                className={classes.colAttribute}
                key={gridAttributeFromSettings}
              >
                {maybe<React.ReactNode>(
                  () =>
                    gridAttributes.find(
                      gridAttribute =>
                        getAttributeIdFromColumnValue(
                          gridAttributeFromSettings
                        ) === gridAttribute.id
                    ).name,
                  <Skeleton />
                )}
              </TableCell>
            ))}
            <DisplayColumn column="price">
              <TableCell className={classes.colPrice}>
                <FormattedMessage
                  defaultMessage="Price"
                  description="product"
                />
              </TableCell>
            </DisplayColumn>
          </TableHead>
          <TableFooter>
            <TableRow>
              <TablePagination
                colSpan={numberOfColumns}
                settings={settings}
                hasNextPage={
                  pageInfo && !disabled ? pageInfo.hasNextPage : false
                }
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
                    data-tc={product ? `product-${product.id}` : undefined}
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
                      data-tc="name"
                    >
                      {maybe<React.ReactNode>(() => product.name, <Skeleton />)}
                    </TableCellAvatar>
                    <DisplayColumn column="productType">
                      <TableCell
                        className={classes.colType}
                        data-tc="product-type"
                      >
                        {product && product.productType ? (
                          product.productType.name
                        ) : (
                          <Skeleton />
                        )}
                      </TableCell>
                    </DisplayColumn>
                    <DisplayColumn column="isPublished">
                      <TableCell
                        className={classes.colPublished}
                        data-tc="isPublished"
                        data-tc-is-published={maybe(() => product.isAvailable)}
                      >
                        {product &&
                        maybe(() => product.isAvailable !== undefined) ? (
                          <StatusLabel
                            label={
                              product.isAvailable
                                ? intl.formatMessage({
                                    defaultMessage: "Published",
                                    description: "product status"
                                  })
                                : intl.formatMessage({
                                    defaultMessage: "Not published",
                                    description: "product status"
                                  })
                            }
                            status={product.isAvailable ? "success" : "error"}
                          />
                        ) : (
                          <Skeleton />
                        )}
                      </TableCell>
                    </DisplayColumn>
                    {gridAttributesFromSettings.map(gridAttribute => {
                      const attribute = maybe(() =>
                        product.attributes.find(
                          attribute =>
                            attribute.attribute.id ===
                            getAttributeIdFromColumnValue(gridAttribute)
                        )
                      );
                      const attributeValues = attribute
                        ? attribute.values.map(value => value.name).join(", ")
                        : "-";

                      return (
                        <TableCell
                          className={classes.colAttribute}
                          key={gridAttribute}
                          data-tc="attribute"
                          data-tc-attribute={maybe(
                            () => attribute.attribute.id
                          )}
                        >
                          {attribute ? attributeValues : <Skeleton />}
                        </TableCell>
                      );
                    })}
                    <DisplayColumn column="price">
                      <TableCell className={classes.colPrice}>
                        {maybe(() => product.basePrice) &&
                        maybe(() => product.basePrice.amount) !== undefined &&
                        maybe(() => product.basePrice.currency) !==
                          undefined ? (
                          <Money money={product.basePrice} />
                        ) : (
                          <Skeleton />
                        )}
                      </TableCell>
                    </DisplayColumn>
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
        </Table>
      </div>
    );
  }
);
ProductList.displayName = "ProductList";
export default ProductList;
