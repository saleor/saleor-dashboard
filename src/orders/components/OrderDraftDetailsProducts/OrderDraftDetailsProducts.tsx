import { TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import { OrderDetailsFragment } from "@saleor/graphql";
import { makeStyles } from "@saleor/macaw-ui";
import {
  OrderLineDiscountConsumer,
  OrderLineDiscountContextConsumerProps,
} from "@saleor/products/components/OrderDiscountProviders/OrderLineDiscountProvider";
import React from "react";
import { FormattedMessage } from "react-intl";

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
    errorInfo: {
      color: theme.palette.error.main,
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
  onOrderLineChange: (id: string, data: FormData) => void;
  onOrderLineRemove: (id: string) => void;
}

const OrderDraftDetailsProducts: React.FC<OrderDraftDetailsProductsProps> = props => {
  const { order, onOrderLineChange, onOrderLineRemove } = props;
  const lines = order?.lines ?? [];

  const classes = useStyles(props);

  return (
    <ResponsiveTable className={classes.table}>
      {!!lines.length && (
        <TableHead>
          <TableRow>
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
          </TableRow>
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
                  channelId={order.channel.id}
                  onOrderLineChange={onOrderLineChange}
                  onOrderLineRemove={onOrderLineRemove}
                />
              )}
            </OrderLineDiscountConsumer>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={5}>
              <FormattedMessage
                id="UD7/q8"
                defaultMessage="No Products added to Order"
              />
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </ResponsiveTable>
  );
};
OrderDraftDetailsProducts.displayName = "OrderDraftDetailsProducts";
export default OrderDraftDetailsProducts;
