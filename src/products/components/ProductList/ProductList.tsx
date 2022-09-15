import { TableBody, TableCell, TableFooter, TableRow } from "@material-ui/core";
import { ChannelsAvailabilityDropdown } from "@saleor/components/ChannelsAvailabilityDropdown";
import {
  getChannelAvailabilityColor,
  getChannelAvailabilityLabel,
} from "@saleor/components/ChannelsAvailabilityDropdown/utils";
import Checkbox from "@saleor/components/Checkbox";
import Date from "@saleor/components/Date";
import MoneyRange from "@saleor/components/MoneyRange";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import Skeleton from "@saleor/components/Skeleton";
import TableCellAvatar from "@saleor/components/TableCellAvatar";
import { AVATAR_MARGIN } from "@saleor/components/TableCellAvatar/Avatar";
import TableCellHeader from "@saleor/components/TableCellHeader";
import TableHead from "@saleor/components/TableHead";
import { TablePaginationWithContext } from "@saleor/components/TablePagination";
import TableRowLink from "@saleor/components/TableRowLink";
import TooltipTableCellHeader from "@saleor/components/TooltipTableCellHeader";
import { commonTooltipMessages } from "@saleor/components/TooltipTableCellHeader/messages";
import { ProductListColumns } from "@saleor/config";
import { GridAttributesQuery, ProductListQuery } from "@saleor/graphql";
import { makeStyles, Pill } from "@saleor/macaw-ui";
import { maybe, renderCollection } from "@saleor/misc";
import {
  getAttributeIdFromColumnValue,
  isAttributeColumnValue,
} from "@saleor/products/components/ProductListPage/utils";
import { ProductListUrlSortField, productUrl } from "@saleor/products/urls";
import { canBeSorted } from "@saleor/products/views/ProductList/sort";
import {
  ChannelProps,
  ListActions,
  ListProps,
  RelayToFlat,
  SortPage,
} from "@saleor/types";
import TDisplayColumn, {
  DisplayColumnProps,
} from "@saleor/utils/columns/DisplayColumn";
import { getArrowDirection } from "@saleor/utils/sort";
import classNames from "classnames";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { columnsMessages } from "./messages";
import ProductListAttribute from "./ProductListAttribute";

const useStyles = makeStyles(
  theme => ({
    [theme.breakpoints.up("md")]: {
      colName: {
        minWidth: 250,
      },
      colPrice: {
        width: 300,
      },
      colPublished: {
        width: 200,
      },
      colType: {
        width: 200,
      },
      colDate: {
        width: 200,
      },
    },
    colAttribute: {
      width: 200,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
    colFill: {
      padding: 0,
      width: "100%",
    },
    colName: {
      "&$colNameFixed": {
        width: 250,
      },
    },
    colNameFixed: {},
    colNameHeader: {
      marginLeft: AVATAR_MARGIN,
    },
    colNameWrapper: {
      display: "block",
    },
    colPrice: {
      textAlign: "right",
    },
    colPublished: {},
    colType: {},
    link: {
      cursor: "pointer",
    },
    table: {
      tableLayout: "fixed",
    },
    tableContainer: {
      overflowX: "scroll",
    },
    textLeft: {
      textAlign: "left",
    },
    textRight: {
      textAlign: "right",
    },
  }),
  { name: "ProductList" },
);

const DisplayColumn = TDisplayColumn as React.FunctionComponent<
  DisplayColumnProps<ProductListColumns>
>;

interface ProductListProps
  extends ListProps<ProductListColumns>,
    ListActions,
    SortPage<ProductListUrlSortField>,
    ChannelProps {
  activeAttributeSortId: string;
  gridAttributes: RelayToFlat<GridAttributesQuery["grid"]>;
  products: RelayToFlat<ProductListQuery["products"]>;
}

export const ProductList: React.FC<ProductListProps> = props => {
  const {
    activeAttributeSortId,
    settings,
    disabled,
    isChecked,
    gridAttributes,
    products,
    selected,
    sort,
    toggle,
    toggleAll,
    toolbar,
    onUpdateListSettings,
    onSort,
    selectedChannelId,
    filterDependency,
  } = props;

  const classes = useStyles(props);
  const intl = useIntl();
  const gridAttributesFromSettings = settings.columns.filter(
    isAttributeColumnValue,
  );
  const numberOfColumns =
    (products?.length === 0 ? 1 : 2) + settings.columns.length;

  return (
    <div className={classes.tableContainer}>
      <ResponsiveTable className={classes.table}>
        <colgroup>
          {products?.length !== 0 && <col />}
          <col className={classes.colName} />
          <DisplayColumn column="productType" displayColumns={settings.columns}>
            <col className={classes.colType} />
          </DisplayColumn>
          <DisplayColumn
            column="availability"
            displayColumns={settings.columns}
          >
            <col className={classes.colPublished} />
          </DisplayColumn>
          {gridAttributesFromSettings.map(gridAttribute => (
            <col className={classes.colAttribute} key={gridAttribute} />
          ))}
          <DisplayColumn column="date" displayColumns={settings.columns}>
            <col className={classes.colDate} />
          </DisplayColumn>
          <DisplayColumn column="price" displayColumns={settings.columns}>
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
          <TableCellHeader
            data-test-id="col-name-header"
            arrowPosition="right"
            className={classNames(classes.colName, {
              [classes.colNameFixed]: settings.columns.length > 4,
            })}
            direction={
              sort.sort === ProductListUrlSortField.name
                ? getArrowDirection(sort.asc)
                : undefined
            }
            onClick={() => onSort(ProductListUrlSortField.name)}
          >
            <span className={classes.colNameHeader}>
              <FormattedMessage
                id="VQLIXd"
                defaultMessage="Name"
                description="product"
              />
            </span>
          </TableCellHeader>
          <DisplayColumn column="productType" displayColumns={settings.columns}>
            <TableCellHeader
              data-test-id="col-type-header"
              className={classes.colType}
              direction={
                sort.sort === ProductListUrlSortField.productType
                  ? getArrowDirection(sort.asc)
                  : undefined
              }
              onClick={() => onSort(ProductListUrlSortField.productType)}
            >
              <FormattedMessage {...columnsMessages.type} />
            </TableCellHeader>
          </DisplayColumn>
          <DisplayColumn
            column="availability"
            displayColumns={settings.columns}
          >
            <TooltipTableCellHeader
              data-test-id="col-availability-header"
              className={classes.colPublished}
              direction={
                sort.sort === ProductListUrlSortField.status
                  ? getArrowDirection(sort.asc)
                  : undefined
              }
              onClick={() => onSort(ProductListUrlSortField.status)}
              disabled={
                !canBeSorted(
                  ProductListUrlSortField.status,
                  !!selectedChannelId,
                )
              }
              tooltip={intl.formatMessage(
                commonTooltipMessages.noFilterSelected,
                { filterName: filterDependency.label },
              )}
            >
              <FormattedMessage {...columnsMessages.availability} />
            </TooltipTableCellHeader>
          </DisplayColumn>
          {gridAttributesFromSettings.map(gridAttributeFromSettings => {
            const attributeId = getAttributeIdFromColumnValue(
              gridAttributeFromSettings,
            );

            return (
              <TableCellHeader
                className={classes.colAttribute}
                direction={
                  sort.sort === ProductListUrlSortField.attribute &&
                  attributeId === activeAttributeSortId
                    ? getArrowDirection(sort.asc)
                    : undefined
                }
                onClick={() =>
                  onSort(ProductListUrlSortField.attribute, attributeId)
                }
                key={gridAttributeFromSettings}
              >
                {maybe<React.ReactNode>(
                  () =>
                    gridAttributes.find(
                      gridAttribute => attributeId === gridAttribute.id,
                    ).name,
                  <Skeleton />,
                )}
              </TableCellHeader>
            );
          })}
          <DisplayColumn column="date" displayColumns={settings.columns}>
            <TableCellHeader
              data-test-id="col-date-header"
              className={classes.colDate}
              direction={
                sort.sort === ProductListUrlSortField.date
                  ? getArrowDirection(sort.asc)
                  : undefined
              }
              onClick={() => onSort(ProductListUrlSortField.date)}
            >
              <FormattedMessage {...columnsMessages.updatedAt} />
            </TableCellHeader>
          </DisplayColumn>
          <DisplayColumn column="price" displayColumns={settings.columns}>
            <TooltipTableCellHeader
              data-test-id="col-price-header"
              className={classes.colPrice}
              direction={
                sort.sort === ProductListUrlSortField.price
                  ? getArrowDirection(sort.asc)
                  : undefined
              }
              textAlign="right"
              onClick={() => onSort(ProductListUrlSortField.price)}
              disabled={
                !canBeSorted(ProductListUrlSortField.price, !!selectedChannelId)
              }
              tooltip={intl.formatMessage(
                commonTooltipMessages.noFilterSelected,
                { filterName: filterDependency.label },
              )}
            >
              <FormattedMessage {...columnsMessages.price} />
            </TooltipTableCellHeader>
          </DisplayColumn>
        </TableHead>
        <TableFooter>
          <TableRow>
            <TablePaginationWithContext
              colSpan={numberOfColumns}
              settings={settings}
              onUpdateListSettings={onUpdateListSettings}
            />
          </TableRow>
        </TableFooter>
        <TableBody>
          {renderCollection(
            products,
            product => {
              const isSelected = product ? isChecked(product.id) : false;
              const channel = product?.channelListings.find(
                listing => listing.channel.id === selectedChannelId,
              );

              return (
                <TableRowLink
                  selected={isSelected}
                  hover={!!product}
                  key={product ? product.id : "skeleton"}
                  href={product && productUrl(product.id)}
                  className={classes.link}
                  data-test-id={"id-" + (product ? product?.id : "skeleton")}
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
                    thumbnail={maybe(() => product.thumbnail.url)}
                  >
                    {product?.name ? (
                      <span data-test-id="name">{product.name}</span>
                    ) : (
                      <Skeleton />
                    )}
                  </TableCellAvatar>
                  <DisplayColumn
                    column="productType"
                    displayColumns={settings.columns}
                  >
                    <TableCell
                      className={classes.colType}
                      data-test-id="product-type"
                    >
                      {product?.productType?.name || <Skeleton />}
                    </TableCell>
                  </DisplayColumn>
                  <DisplayColumn
                    column="availability"
                    displayColumns={settings.columns}
                  >
                    <TableCell
                      className={classes.colPublished}
                      data-test-id="availability"
                      data-test-availability={
                        !!product?.channelListings?.length
                      }
                    >
                      {(product &&
                        (channel ? (
                          <Pill
                            label={intl.formatMessage(
                              getChannelAvailabilityLabel(channel),
                            )}
                            color={getChannelAvailabilityColor(channel)}
                          />
                        ) : (
                          <ChannelsAvailabilityDropdown
                            channels={product?.channelListings}
                          />
                        ))) ?? <Skeleton />}
                    </TableCell>
                  </DisplayColumn>
                  {gridAttributesFromSettings.map(gridAttribute => (
                    <TableCell
                      className={classes.colAttribute}
                      key={gridAttribute}
                      data-test-id="attribute"
                      data-test-attribute={getAttributeIdFromColumnValue(
                        gridAttribute,
                      )}
                    >
                      <ProductListAttribute
                        attribute={gridAttribute}
                        productAttributes={product?.attributes}
                      />
                    </TableCell>
                  ))}
                  <DisplayColumn
                    column="date"
                    displayColumns={settings.columns}
                  >
                    <TableCell className={classes.colDate} data-test-id="date">
                      {product?.updatedAt ? (
                        <Date date={product.updatedAt} />
                      ) : (
                        <Skeleton />
                      )}
                    </TableCell>
                  </DisplayColumn>
                  <DisplayColumn
                    column="price"
                    displayColumns={settings.columns}
                  >
                    <TableCell
                      className={classes.colPrice}
                      data-test-id="price"
                    >
                      {product?.channelListings ? (
                        <MoneyRange
                          from={channel?.pricing?.priceRange?.start?.net}
                          to={channel?.pricing?.priceRange?.stop?.net}
                        />
                      ) : (
                        <Skeleton />
                      )}
                    </TableCell>
                  </DisplayColumn>
                </TableRowLink>
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
            ),
          )}
        </TableBody>
      </ResponsiveTable>
    </div>
  );
};
ProductList.displayName = "ProductList";
export default ProductList;
