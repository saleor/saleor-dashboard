import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import { createStyles, withStyles, WithStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import CardTitle from "@saleor/components/CardTitle";
import Money from "@saleor/components/Money";
import Skeleton from "@saleor/components/Skeleton";
import StatusLabel from "@saleor/components/StatusLabel";
import TableCellAvatar, {
  AVATAR_MARGIN
} from "@saleor/components/TableCellAvatar";
import { maybe } from "../../../misc";
import { OrderDetails_order_lines } from "../../types/OrderDetails";

const styles = createStyles({
  clickableRow: {
    cursor: "pointer"
  },
  colName: {
    paddingLeft: 0,
    width: "auto"
  },
  colNameLabel: {
    marginLeft: AVATAR_MARGIN
  },
  colPrice: {
    textAlign: "right",
    width: 120
  },
  colQuantity: {
    textAlign: "center",
    width: 120
  },
  colTotal: {
    textAlign: "right",
    width: 120
  },
  statusBar: {
    paddingTop: 0
  },
  table: {
    tableLayout: "fixed"
  }
});

interface OrderUnfulfilledItemsProps extends WithStyles<typeof styles> {
  canFulfill: boolean;
  lines: OrderDetails_order_lines[];
  onFulfill: () => void;
}

const OrderUnfulfilledItems = withStyles(styles, {
  name: "OrderUnfulfilledItems"
})(({ canFulfill, classes, lines, onFulfill }: OrderUnfulfilledItemsProps) => {
  const intl = useIntl();

  return (
    <Card>
      <CardTitle
        title={
          <StatusLabel
            label={intl.formatMessage(
              {
                defaultMessage: "Unfulfilled ({quantity})",
                description: "section header"
              },
              {
                quantity: lines
                  .map(line => line.quantity - line.quantityFulfilled)
                  .reduce((prev, curr) => prev + curr, 0)
              }
            )}
            status="error"
          />
        }
      />
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell className={classes.colName}>
              <span className={classes.colNameLabel}>
                <FormattedMessage
                  defaultMessage="Product"
                  description="product name"
                />
              </span>
            </TableCell>
            <TableCell className={classes.colQuantity}>
              <FormattedMessage
                defaultMessage="Quantity"
                description="ordered products"
              />
            </TableCell>
            <TableCell className={classes.colPrice}>
              <FormattedMessage
                defaultMessage="Price"
                description="product unit price"
              />
            </TableCell>
            <TableCell className={classes.colTotal}>
              <FormattedMessage
                defaultMessage="Total"
                description="order line total price"
              />
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {lines.map(line => (
            <TableRow
              className={!!line ? classes.clickableRow : undefined}
              hover={!!line}
              key={maybe(() => line.id)}
            >
              <TableCellAvatar
                className={classes.colName}
                thumbnail={maybe(() => line.thumbnail.url)}
              >
                {maybe(() => line.productName) || <Skeleton />}
              </TableCellAvatar>
              <TableCell className={classes.colQuantity}>
                {maybe(() => line.quantity - line.quantityFulfilled) || (
                  <Skeleton />
                )}
              </TableCell>
              <TableCell className={classes.colPrice}>
                {maybe(() => line.unitPrice.gross) ? (
                  <Money money={line.unitPrice.gross} />
                ) : (
                  <Skeleton />
                )}
              </TableCell>
              <TableCell className={classes.colTotal}>
                {maybe(
                  () =>
                    (line.quantity - line.quantityFulfilled) *
                    line.unitPrice.gross.amount
                ) ? (
                  <Money
                    money={{
                      amount:
                        (line.quantity - line.quantityFulfilled) *
                        line.unitPrice.gross.amount,
                      currency: line.unitPrice.gross.currency
                    }}
                  />
                ) : (
                  <Skeleton />
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {canFulfill && (
        <CardActions>
          <Button variant="text" color="primary" onClick={onFulfill}>
            <FormattedMessage defaultMessage="Fulfill" description="button" />
          </Button>
        </CardActions>
      )}
    </Card>
  );
});
OrderUnfulfilledItems.displayName = "OrderUnfulfilledItems";
export default OrderUnfulfilledItems;
