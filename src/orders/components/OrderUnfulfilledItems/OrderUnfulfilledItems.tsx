import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import { makeStyles } from "@material-ui/core/styles";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import CardTitle from "@saleor/components/CardTitle";
import Money from "@saleor/components/Money";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import Skeleton from "@saleor/components/Skeleton";
import StatusLabel from "@saleor/components/StatusLabel";
import TableCellAvatar, {
  AVATAR_MARGIN
} from "@saleor/components/TableCellAvatar";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { maybe } from "../../../misc";
import { OrderDetails_order_lines } from "../../types/OrderDetails";

const useStyles = makeStyles(
  {
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
    colSku: {
      textAlign: "right",
      textOverflow: "ellipsis",
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
  },
  { name: "OrderUnfulfilledItems" }
);

interface OrderUnfulfilledItemsProps {
  canFulfill: boolean;
  lines: OrderDetails_order_lines[];
  onFulfill: () => void;
}

const OrderUnfulfilledItems: React.FC<OrderUnfulfilledItemsProps> = props => {
  const { canFulfill, lines, onFulfill } = props;
  const classes = useStyles(props);

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
      <ResponsiveTable className={classes.table}>
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
            <TableCell className={classes.colSku}>
              <FormattedMessage
                defaultMessage="SKU"
                description="ordered product sku"
              />
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
              <TableCell className={classes.colSku}>
                {line?.productSku || <Skeleton />}
              </TableCell>
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
      </ResponsiveTable>
      {canFulfill && (
        <CardActions>
          <Button variant="text" color="primary" onClick={onFulfill}>
            <FormattedMessage defaultMessage="Fulfill" description="button" />
          </Button>
        </CardActions>
      )}
    </Card>
  );
};
OrderUnfulfilledItems.displayName = "OrderUnfulfilledItems";
export default OrderUnfulfilledItems;
