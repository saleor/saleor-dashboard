import ResponsiveTable from "@dashboard/components/ResponsiveTable";
import Skeleton from "@dashboard/components/Skeleton";
import TableRowLink from "@dashboard/components/TableRowLink";
import { OrderDetailsFragment, OrderErrorFragment } from "@dashboard/graphql";
import {
  OrderLineDiscountConsumer,
  OrderLineDiscountContextConsumerProps,
} from "@dashboard/products/components/OrderDiscountProviders/OrderLineDiscountProvider";
import getOrderErrorMessage from "@dashboard/utils/errors/order";
import { TableBody, TableCell, TableHead, Typography } from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { renderCollection } from "../../../misc";
import TableLine from "./TableLine";

export interface FormData {
  quantity: number;
}

const useStyles = makeStyles(
  theme => ({
    colAction: {
      width: theme.spacing(10),
    },
    colName: {
      width: "auto",
    },
    colNameLabel: {},
    colPrice: {},
    colQuantity: {},
    colTotal: {},
    skeleton: {
      margin: theme.spacing(0, 4),
    },
    errorInfo: {
      color: theme.palette.error.main,
      marginLeft: theme.spacing(1.5),
      display: "inline",
    },
    quantityField: {
      "& input": {
        padding: "12px 12px 10px",
      },
      width: 60,
    },
    table: {
      [theme.breakpoints.up("md")]: {
        tableLayout: "auto",
      },
      tableLayout: "auto",
    },
  }),
  { name: "OrderDraftDetailsProducts" },
);

interface OrderDraftDetailsProductsProps {
  order?: OrderDetailsFragment;
  errors: OrderErrorFragment[];
  onOrderLineChange: (id: string, data: FormData) => void;
  onOrderLineRemove: (id: string) => void;
}

const OrderDraftDetailsProducts: React.FC<
  OrderDraftDetailsProductsProps
> = props => {
  const { order, errors, onOrderLineChange, onOrderLineRemove } = props;
  const lines = order?.lines ?? [];

  const intl = useIntl();
  const classes = useStyles(props);

  const formErrors = errors.filter(error => error.field === "lines");

  if (order === undefined) {
    return <Skeleton className={classes.skeleton} />;
  }

  return (
    <ResponsiveTable className={classes.table}>
      {!!lines.length && (
        <TableHead>
          <TableRowLink>
            <TableCell className={classes.colName} colSpan={2}>
              <span className={classes.colNameLabel}>
                <FormattedMessage id="x/ZVlU" defaultMessage="Product" />
              </span>
            </TableCell>
            <TableCell className={classes.colQuantity}>
              <FormattedMessage
                id="nEWp+k"
                defaultMessage="Quantity"
                description="quantity of ordered products"
              />
            </TableCell>
            <TableCell className={classes.colPrice}>
              <FormattedMessage
                id="32dfzI"
                defaultMessage="Price"
                description="price or ordered products"
              />
            </TableCell>
            <TableCell className={classes.colTotal}>
              <FormattedMessage
                id="lVwmf5"
                defaultMessage="Total"
                description="total price of ordered products"
              />
            </TableCell>
            <TableCell className={classes.colAction} />
          </TableRowLink>
        </TableHead>
      )}
      <TableBody>
        {!!lines.length ? (
          renderCollection(lines, line => (
            <OrderLineDiscountConsumer key={line.id} orderLineId={line.id}>
              {(
                orderLineDiscountProps: OrderLineDiscountContextConsumerProps,
              ) => (
                <TableLine
                  {...orderLineDiscountProps}
                  line={line}
                  error={formErrors.find(error =>
                    error.orderLines?.some(id => id === line.id),
                  )}
                  onOrderLineChange={onOrderLineChange}
                  onOrderLineRemove={onOrderLineRemove}
                />
              )}
            </OrderLineDiscountConsumer>
          ))
        ) : (
          <>
            <TableRowLink>
              <TableCell colSpan={5}>
                <FormattedMessage
                  id="UD7/q8"
                  defaultMessage="No Products added to Order"
                />
                {!!formErrors.length && (
                  <Typography variant="body2" className={classes.errorInfo}>
                    {getOrderErrorMessage(formErrors[0], intl)}
                  </Typography>
                )}
              </TableCell>
            </TableRowLink>
          </>
        )}
      </TableBody>
    </ResponsiveTable>
  );
};
OrderDraftDetailsProducts.displayName = "OrderDraftDetailsProducts";
export default OrderDraftDetailsProducts;
