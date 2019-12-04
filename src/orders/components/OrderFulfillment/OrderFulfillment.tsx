import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import { makeStyles } from "@material-ui/core/styles";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import CardMenu from "@saleor/components/CardMenu";
import CardTitle from "@saleor/components/CardTitle";
import Money from "@saleor/components/Money";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import Skeleton from "@saleor/components/Skeleton";
import StatusLabel from "@saleor/components/StatusLabel";
import TableCellAvatar, {
  AVATAR_MARGIN
} from "@saleor/components/TableCellAvatar";
import { maybe, renderCollection } from "../../../misc";
import { FulfillmentStatus } from "../../../types/globalTypes";
import { OrderDetails_order_fulfillments } from "../../types/OrderDetails";

const useStyles = makeStyles(
  theme => ({
    clickableRow: {
      cursor: "pointer"
    },
    colName: {
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

    orderNumber: {
      display: "inline",
      marginLeft: theme.spacing(1)
    },
    statusBar: {
      paddingTop: 0
    },
    table: {
      tableLayout: "fixed"
    }
  }),
  { name: "OrderFulfillment" }
);

interface OrderFulfillmentProps {
  fulfillment: OrderDetails_order_fulfillments;
  orderNumber: string;
  onOrderFulfillmentCancel: () => void;
  onTrackingCodeAdd: () => void;
}

const numberOfColumns = 3;

const OrderFulfillment: React.FC<OrderFulfillmentProps> = props => {
  const {
    fulfillment,
    orderNumber,
    onOrderFulfillmentCancel,
    onTrackingCodeAdd
  } = props;
  const classes = useStyles(props);

  const intl = useIntl();

  const lines = maybe(() => fulfillment.lines);
  const status = maybe(() => fulfillment.status);
  const quantity = lines
    ? lines.map(line => line.quantity).reduce((prev, curr) => prev + curr, 0)
    : "...";

  return (
    <Card>
      <CardTitle
        title={
          !!lines ? (
            <StatusLabel
              label={
                <>
                  {status === FulfillmentStatus.FULFILLED
                    ? intl.formatMessage(
                        {
                          defaultMessage: "Fulfilled ({quantity})",
                          description: "section header"
                        },
                        {
                          quantity
                        }
                      )
                    : intl.formatMessage(
                        {
                          defaultMessage: "Fulfilled ({quantity})",
                          description: "section header"
                        },
                        {
                          quantity
                        }
                      )}
                  <Typography className={classes.orderNumber} variant="body1">
                    {maybe(
                      () => `#${orderNumber}-${fulfillment.fulfillmentOrder}`
                    )}
                  </Typography>
                </>
              }
              status={
                status === FulfillmentStatus.FULFILLED ? "success" : "error"
              }
            />
          ) : (
            <Skeleton />
          )
        }
        toolbar={
          maybe(() => fulfillment.status) === FulfillmentStatus.FULFILLED && (
            <CardMenu
              menuItems={[
                {
                  label: intl.formatMessage({
                    defaultMessage: "Cancel shipment",
                    description: "button"
                  }),
                  onSelect: onOrderFulfillmentCancel
                }
              ]}
            />
          )
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
            <TableCell className={classes.colQuantity}>
              <FormattedMessage
                defaultMessage="Quantity"
                description="ordered product quantity"
              />
            </TableCell>
            <TableCell className={classes.colPrice}>
              <FormattedMessage
                defaultMessage="Price"
                description="product price"
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
          {renderCollection(lines, line => (
            <TableRow
              className={!!line ? classes.clickableRow : undefined}
              hover={!!line}
              key={maybe(() => line.id)}
            >
              <TableCellAvatar
                className={classes.colName}
                thumbnail={maybe(() => line.orderLine.thumbnail.url)}
              >
                {maybe(() => line.orderLine.productName) || <Skeleton />}
              </TableCellAvatar>
              <TableCell className={classes.colQuantity}>
                {maybe(() => line.quantity) || <Skeleton />}
              </TableCell>
              <TableCell className={classes.colPrice}>
                {maybe(() => line.orderLine.unitPrice.gross) ? (
                  <Money money={line.orderLine.unitPrice.gross} />
                ) : (
                  <Skeleton />
                )}
              </TableCell>
              <TableCell className={classes.colTotal}>
                {maybe(
                  () => line.quantity * line.orderLine.unitPrice.gross.amount
                ) ? (
                  <Money
                    money={{
                      amount:
                        line.quantity * line.orderLine.unitPrice.gross.amount,
                      currency: line.orderLine.unitPrice.gross.currency
                    }}
                  />
                ) : (
                  <Skeleton />
                )}
              </TableCell>
            </TableRow>
          ))}
          {maybe(() => fulfillment.trackingNumber) && (
            <TableRow>
              <TableCell colSpan={numberOfColumns}>
                <FormattedMessage
                  defaultMessage="Tracking Number: {trackingNumber}"
                  values={{
                    trackingNumber: fulfillment.trackingNumber
                  }}
                />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </ResponsiveTable>
      {status === FulfillmentStatus.FULFILLED && !fulfillment.trackingNumber && (
        <CardActions>
          <Button color="primary" onClick={onTrackingCodeAdd}>
            <FormattedMessage
              defaultMessage="Add tracking"
              description="fulfillment group tracking number"
            />
          </Button>
        </CardActions>
      )}
    </Card>
  );
};
OrderFulfillment.displayName = "OrderFulfillment";
export default OrderFulfillment;
