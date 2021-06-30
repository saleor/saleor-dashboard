import {
  TableBody,
  TableCell,
  TableFooter,
  TableRow,
  Typography
} from "@material-ui/core";
import { ChannelsAvailabilityDropdown } from "@saleor/components/ChannelsAvailabilityDropdown";
import Checkbox from "@saleor/components/Checkbox";
import MoneyRange from "@saleor/components/MoneyRange";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import Skeleton from "@saleor/components/Skeleton";
import TableCellAvatar from "@saleor/components/TableCellAvatar";
import { AVATAR_MARGIN } from "@saleor/components/TableCellAvatar/Avatar";
import TableCellHeader from "@saleor/components/TableCellHeader";
import TableHead from "@saleor/components/TableHead";
import TablePagination from "@saleor/components/TablePagination";
import { ProductListColumns } from "@saleor/config";
import { maybe, renderCollection } from "@saleor/misc";
import {
  getAttributeIdFromColumnValue,
  isAttributeColumnValue
} from "@saleor/products/components/ProductListPage/utils";
import { GridAttributes_grid_edges_node } from "@saleor/products/types/GridAttributes";
import { ProductList_products_edges_node } from "@saleor/products/types/ProductList";
import { ProductListUrlSortField } from "@saleor/products/urls";
import { canBeSorted } from "@saleor/products/views/ProductList/sort";
import { makeStyles } from "@saleor/theme";
import { ChannelProps, ListActions, ListProps, SortPage } from "@saleor/types";
import TDisplayColumn, {
  DisplayColumnProps
} from "@saleor/utils/columns/DisplayColumn";
import { getArrowDirection } from "@saleor/utils/sort";
import classNames from "classnames";
import React from "react";
import { FormattedMessage } from "react-intl";

import ProductAvailabilityStatusLabel from "../ProductAvailabilityStatusLabel";

const useStyles = makeStyles(
  theme => ({
    [theme.breakpoints.up("lg")]: {
      colName: {
        width: "auto"
      },
      colPrice: {
        width: 300
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
    colNameWrapper: {
      display: "block"
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
  { name: "ProductList" }
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
  gridAttributes: GridAttributes_grid_edges_node[];
  products: ProductList_products_edges_node[];
  loading: boolean;
  channelsCount: number;
}

export const ProductList: React.FC<ProductListProps> = props => {
  const {
    activeAttributeSortId,
    channelsCount,
    settings,
    disabled,
    isChecked,
    gridAttributes,
    pageInfo,
    products,
    selected,
    sort,
    toggle,
    toggleAll,
    toolbar,
    onNextPage,
    onPreviousPage,
    onUpdateListSettings,
    onRowClick,
    onSort,
    selectedChannelId
  } = props;

  const classes = useStyles(props);
  const gridAttributesFromSettings = settings.columns.filter(
    isAttributeColumnValue
  );
  const numberOfColumns = 2 + settings.columns.length;

  return (
    <div className={classes.tableContainer}>
      <ResponsiveTable className={classes.table}>
        <colgroup>
          <col />
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
            data-test-id="colNameHeader"
            arrowPosition="right"
            className={classNames(classes.colName, {
              [classes.colNameFixed]: settings.columns.length > 4
            })}
            direction={
              sort.sort === ProductListUrlSortField.name
                ? getArrowDirection(sort.asc)
                : undefined
            }
            onClick={() => onSort(ProductListUrlSortField.name)}
          >
            <span className={classes.colNameHeader}>
              <FormattedMessage defaultMessage="Name" description="product" />
            </span>
          </TableCellHeader>
          <DisplayColumn column="productType" displayColumns={settings.columns}>
            <TableCellHeader
              data-test-id="colTypeHeader"
              className={classes.colType}
              direction={
                sort.sort === ProductListUrlSortField.productType
                  ? getArrowDirection(sort.asc)
                  : undefined
              }
              onClick={() => onSort(ProductListUrlSortField.productType)}
            >
              <FormattedMessage
                defaultMessage="Type"
                description="product type"
              />
            </TableCellHeader>
          </DisplayColumn>
          <DisplayColumn
            column="availability"
            displayColumns={settings.columns}
          >
            <TableCellHeader
              data-test-id="colAvailabilityHeader"
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
                  !!selectedChannelId
                )
              }
            >
              <FormattedMessage
                defaultMessage="Availability"
                description="product channels"
              />
            </TableCellHeader>
          </DisplayColumn>
          {gridAttributesFromSettings.map(gridAttributeFromSettings => {
            const attributeId = getAttributeIdFromColumnValue(
              gridAttributeFromSettings
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
                      gridAttribute => attributeId === gridAttribute.id
                    ).name,
                  <Skeleton />
                )}
              </TableCellHeader>
            );
          })}
          <DisplayColumn column="price" displayColumns={settings.columns}>
            <TableCellHeader
              data-test-id="colPriceHeader"
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
            >
              <FormattedMessage
                defaultMessage="Price"
                description="product price"
              />
            </TableCellHeader>
          </DisplayColumn>
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
            products,
            product => {
              const isSelected = product ? isChecked(product.id) : false;
              const channel = product?.channelListings.find(
                listing => listing.channel.id === selectedChannelId
              );

              return (
                <TableRow
                  selected={isSelected}
                  hover={!!product}
                  key={product ? product.id : "skeleton"}
                  onClick={product && onRowClick(product.id)}
                  className={classes.link}
                  data-test="id"
                  data-test-id={product ? product?.id : "skeleton"}
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
                    {product?.productType ? (
                      <div className={classes.colNameWrapper}>
                        <span data-test="name">{product.name}</span>
                        {product?.productType && (
                          <Typography variant="caption">
                            {product.productType.hasVariants ? (
                              <FormattedMessage
                                defaultMessage="Configurable"
                                description="product type"
                              />
                            ) : (
                              <FormattedMessage
                                defaultMessage="Simple"
                                description="product type"
                              />
                            )}
                          </Typography>
                        )}
                      </div>
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
                      data-test="product-type"
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
                      data-test="availability"
                      data-test-availability={
                        !!product?.channelListings?.length
                      }
                    >
                      {(!product && <Skeleton />) ||
                        (!product?.channelListings?.length && "-") ||
                        (product?.channelListings !== undefined && channel ? (
                          <ProductAvailabilityStatusLabel channel={channel} />
                        ) : (
                          <ChannelsAvailabilityDropdown
                            allChannelsCount={channelsCount}
                            channels={product?.channelListings}
                            showStatus
                          />
                        ))}
                    </TableCell>
                  </DisplayColumn>
                  {gridAttributesFromSettings.map(gridAttribute => (
                    <TableCell
                      className={classes.colAttribute}
                      key={gridAttribute}
                      data-test="attribute"
                      data-test-attribute={getAttributeIdFromColumnValue(
                        gridAttribute
                      )}
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
                  <DisplayColumn
                    column="price"
                    displayColumns={settings.columns}
                  >
                    <TableCell className={classes.colPrice} data-test="price">
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
ProductList.displayName = "ProductList";
export default ProductList;
