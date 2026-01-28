// @ts-strict-ignore
import { DashboardCard } from "@dashboard/components/Card";
import { ChannelsAvailabilityDropdown } from "@dashboard/components/ChannelsAvailabilityDropdown";
import Checkbox from "@dashboard/components/Checkbox";
import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { Placeholder } from "@dashboard/components/Placeholder";
import { ResponsiveTable } from "@dashboard/components/ResponsiveTable";
import { TableButtonWrapper } from "@dashboard/components/TableButtonWrapper/TableButtonWrapper";
import TableCellAvatar from "@dashboard/components/TableCellAvatar";
import TableHead from "@dashboard/components/TableHead";
import { TablePaginationWithContext } from "@dashboard/components/TablePagination";
import TableRowLink from "@dashboard/components/TableRowLink";
import { SearchProductFragment } from "@dashboard/graphql";
import { maybe, renderCollection } from "@dashboard/misc";
import { productUrl } from "@dashboard/products/urls";
import { ListActions, ListProps } from "@dashboard/types";
import { TableBody, TableCell } from "@material-ui/core";
import { IconButton } from "@saleor/macaw-ui";
import { Button, Skeleton } from "@saleor/macaw-ui-next";
import { Trash2 } from "lucide-react";
import { FormattedMessage, useIntl } from "react-intl";

import { messages } from "./messages";
import { useStyles } from "./styles";

interface SaleProductsProps extends ListProps, ListActions {
  products: SearchProductFragment[];
  onProductAssign: () => void;
  onProductUnassign: (id: string) => void;
}

const numberOfColumns = 5;
const DiscountProducts = (props: SaleProductsProps) => {
  const {
    products,
    disabled,
    onProductAssign,
    onProductUnassign,
    isChecked,
    selected,
    toggle,
    toggleAll,
    toolbar,
  } = props;
  const classes = useStyles(props);
  const intl = useIntl();

  return (
    <DashboardCard data-test-id="assign-product-section">
      <DashboardCard.Header>
        <DashboardCard.Title>
          {intl.formatMessage(messages.discountProductsHeader)}
        </DashboardCard.Title>
        <DashboardCard.Toolbar>
          <Button onClick={onProductAssign} data-test-id="assign-products" variant="secondary">
            <FormattedMessage {...messages.discountProductsButton} />
          </Button>
        </DashboardCard.Toolbar>
      </DashboardCard.Header>
      <DashboardCard.Content>
        {products === undefined ? (
          <Skeleton />
        ) : products.length === 0 ? (
          <Placeholder>
            <FormattedMessage {...messages.discountProductsNotFound} />
          </Placeholder>
        ) : (
          <ResponsiveTable footer={<TablePaginationWithContext />}>
            <colgroup>
              <col />
              <col className={classes.colName} />
              <col className={classes.colType} />
              <col className={classes.colPublished} />
              <col className={classes.colActions} />
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
                <span className={products?.length > 0 && classes.colNameLabel}>
                  <FormattedMessage {...messages.discountProductsTableProductHeader} />
                </span>
              </TableCell>
              <TableCell className={classes.colType}>
                <FormattedMessage {...messages.discountProductsTableTypeHeader} />
              </TableCell>
              <TableCell className={classes.colPublished}>
                <FormattedMessage {...messages.discountProductsTableAvailabilityHeader} />
              </TableCell>
              <TableCell className={classes.colActions} />
            </TableHead>
            <TableBody data-test-id="assigned-specific-products-table">
              {renderCollection(products, product => {
                const isSelected = product ? isChecked(product.id) : false;

                return (
                  <TableRowLink
                    hover={!!product}
                    key={product ? product.id : "skeleton"}
                    href={product && productUrl(product.id)}
                    className={classes.tableRow}
                    selected={isSelected}
                    data-test-id="assigned-specific-product"
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
                      thumbnail={maybe(() => product.thumbnail?.url)}
                    >
                      {maybe<React.ReactNode>(() => product.name, <Skeleton />)}
                    </TableCellAvatar>
                    <TableCell className={classes.colType}>
                      {maybe<React.ReactNode>(() => product.productType.name, <Skeleton />)}
                    </TableCell>
                    <TableCell className={classes.colType}>
                      {product && !product?.channelListings?.length ? (
                        "-"
                      ) : product?.channelListings !== undefined ? (
                        <ChannelsAvailabilityDropdown channels={product?.channelListings} />
                      ) : (
                        <Skeleton />
                      )}
                    </TableCell>
                    <TableCell className={classes.colActions}>
                      <TableButtonWrapper>
                        <IconButton
                          variant="secondary"
                          disabled={!product || disabled}
                          onClick={event => {
                            event.stopPropagation();
                            onProductUnassign(product.id);
                          }}
                        >
                          <Trash2 size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />
                        </IconButton>
                      </TableButtonWrapper>
                    </TableCell>
                  </TableRowLink>
                );
              })}
            </TableBody>
          </ResponsiveTable>
        )}
      </DashboardCard.Content>
    </DashboardCard>
  );
};

DiscountProducts.displayName = "DiscountProducts";
export default DiscountProducts;
