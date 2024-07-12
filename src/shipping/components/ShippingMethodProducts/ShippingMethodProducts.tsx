// @ts-strict-ignore
import { Button } from "@dashboard/components/Button";
import { DashboardCard } from "@dashboard/components/Card";
import Checkbox from "@dashboard/components/Checkbox";
import ResponsiveTable from "@dashboard/components/ResponsiveTable";
import Skeleton from "@dashboard/components/Skeleton";
import TableCellAvatar from "@dashboard/components/TableCellAvatar";
import TableHead from "@dashboard/components/TableHead";
import { TablePaginationWithContext } from "@dashboard/components/TablePagination";
import TableRowLink from "@dashboard/components/TableRowLink";
import { ShippingZoneQuery } from "@dashboard/graphql";
import { renderCollection } from "@dashboard/misc";
import { ListActions, ListProps, RelayToFlat } from "@dashboard/types";
import { TableBody, TableCell, TableFooter, Typography } from "@material-ui/core";
import { DeleteIcon, IconButton, makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

const useStyles = makeStyles(
  theme => ({
    colAction: {
      "&:last-child": {
        paddingRight: theme.spacing(3),
      },
      textAlign: "right",
      width: 100,
    },
    colName: {
      width: "auto",
    },
    colProductName: {
      paddingLeft: 0,
    },
    table: {
      tableLayout: "fixed",
    },
  }),
  { name: "ShippingMethodProducts" },
);

export interface ShippingMethodProductsProps
  extends Pick<ListProps, Exclude<keyof ListProps, "getRowHref">>,
    ListActions {
  products: RelayToFlat<
    ShippingZoneQuery["shippingZone"]["shippingMethods"][0]["excludedProducts"]
  >;
  onProductAssign: () => void;
  onProductUnassign: (ids: string[]) => void;
}

const numberOfColumns = 3;
const ShippingMethodProducts: React.FC<ShippingMethodProductsProps> = props => {
  const {
    disabled,
    products,
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
    <DashboardCard>
      <DashboardCard.Title
        title={intl.formatMessage({
          id: "t3aiWF",
          defaultMessage: "Excluded Products",
          description: "section header",
        })}
      />
      <DashboardCard.Toolbar>
        <Button data-test-id="assign-product-button" variant="tertiary" onClick={onProductAssign}>
          <FormattedMessage id="U8eeLW" defaultMessage="Assign products" description="button" />
        </Button>
      </DashboardCard.Toolbar>
      <ResponsiveTable className={classes.table}>
        {!!products?.length && (
          <>
            <TableHead
              colSpan={numberOfColumns}
              selected={selected}
              disabled={disabled}
              items={products}
              toggleAll={toggleAll}
              toolbar={toolbar}
            >
              <TableCell className={classes.colProductName}>
                <FormattedMessage id="ZIc5lM" defaultMessage="Product Name" />
              </TableCell>
              <TableCell className={classes.colAction}>
                <FormattedMessage id="wL7VAE" defaultMessage="Actions" />
              </TableCell>
            </TableHead>
            <TableFooter>
              <TableRowLink>
                <TablePaginationWithContext colSpan={numberOfColumns} disabled={disabled} />
              </TableRowLink>
            </TableFooter>
          </>
        )}
        <TableBody>
          {products?.length === 0 ? (
            <TableRowLink>
              <TableCell colSpan={5}>
                <FormattedMessage id="Gg4+K7" defaultMessage="No Products" />
              </TableCell>
            </TableRowLink>
          ) : (
            renderCollection(products, product => {
              const isSelected = product ? isChecked(product.id) : false;

              return (
                <TableRowLink
                  data-test-id="excluded-products-rows"
                  key={product ? product.id : "skeleton"}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isSelected}
                      disabled={disabled}
                      disableClickPropagation
                      onChange={() => toggle(product.id)}
                    />
                  </TableCell>
                  <TableCellAvatar className={classes.colName} thumbnail={product?.thumbnail?.url}>
                    {product?.name ? (
                      <Typography variant="body2">{product.name}</Typography>
                    ) : (
                      <Skeleton />
                    )}
                  </TableCellAvatar>
                  <TableCell className={classes.colAction}>
                    <IconButton variant="secondary" onClick={() => onProductUnassign([product.id])}>
                      <DeleteIcon color="primary" />
                    </IconButton>
                  </TableCell>
                </TableRowLink>
              );
            })
          )}
        </TableBody>
      </ResponsiveTable>
    </DashboardCard>
  );
};

ShippingMethodProducts.displayName = "ShippingMethodProducts";
export default ShippingMethodProducts;
