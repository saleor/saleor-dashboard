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

import Checkbox from "@saleor/components/Checkbox";
import Money from "@saleor/components/Money";
import Skeleton from "@saleor/components/Skeleton";
import StatusLabel from "@saleor/components/StatusLabel";
import TableCellAvatar, {
  AVATAR_MARGIN
} from "@saleor/components/TableCellAvatar";
import TableHead from "@saleor/components/TableHead";
import TablePagination from "@saleor/components/TablePagination";
import { ProductListColumns } from "@saleor/config";
import i18n from "@saleor/i18n";
import { maybe, renderCollection } from "@saleor/misc";
import {
  getAttributeIdFromColumnValue,
  isAttributeColumnValue
} from "@saleor/products/components/ProductListPage/utils";
import { AvailableInGridAttributes_grid_edges_node } from "@saleor/products/types/AvailableInGridAttributes";
import { ProductList_products_edges_node } from "@saleor/products/types/ProductList";
import { ListActions, ListProps } from "@saleor/types";
import TDisplayColumn from "@saleor/utils/columns/DisplayColumn";

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
      }
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
                {i18n.t("Name", { context: "object" })}
              </span>
            </TableCell>
            <DisplayColumn column="productType">
              <TableCell className={classes.colType}>
                {i18n.t("Type", { context: "object" })}
              </TableCell>
            </DisplayColumn>
            <DisplayColumn column="isPublished">
              <TableCell className={classes.colPublished}>
                {i18n.t("Published", { context: "object" })}
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
                {i18n.t("Price", { context: "object" })}
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
                      {maybe<React.ReactNode>(() => product.name, <Skeleton />)}
                    </TableCellAvatar>
                    <DisplayColumn column="productType">
                      <TableCell className={classes.colType}>
                        {product && product.productType ? (
                          product.productType.name
                        ) : (
                          <Skeleton />
                        )}
                      </TableCell>
                    </DisplayColumn>
                    <DisplayColumn column="isPublished">
                      <TableCell className={classes.colPublished}>
                        {product &&
                        maybe(() => product.isAvailable !== undefined) ? (
                          <StatusLabel
                            label={
                              product.isAvailable
                                ? i18n.t("Published", {
                                    context: "product status"
                                  })
                                : i18n.t("Not published", {
                                    context: "product status"
                                  })
                            }
                            status={product.isAvailable ? "success" : "error"}
                          />
                        ) : (
                          <Skeleton />
                        )}
                      </TableCell>
                    </DisplayColumn>
                    {gridAttributesFromSettings.map(gridAttribute => (
                      <TableCell
                        className={classes.colAttribute}
                        key={gridAttribute}
                      >
                        {maybe<React.ReactNode>(() => {
                          const attribute = product.attributes.find(
                            attribute =>
                              attribute.attribute.id ===
                              getAttributeIdFromColumnValue(gridAttribute)
                          );
                          if (attribute) {
                            return attribute.values
                              .map(value => value.name)
                              .join(", ");
                          }
                          return "-";
                        }, <Skeleton />)}
                      </TableCell>
                    ))}
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
                    {i18n.t("No products found")}
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
