import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import { makeStyles } from "@material-ui/core/styles";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import CardMenu from "@saleor/components/CardMenu";
import CardTitle from "@saleor/components/CardTitle";
import Money from "@saleor/components/Money";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import Skeleton from "@saleor/components/Skeleton";
import StatusLabel from "@saleor/components/StatusLabel";
import TableCellAvatar, {
  AVATAR_MARGIN
} from "@saleor/components/TableCellAvatar";
import { mergeRepeatedOrderLines } from "@saleor/orders/utils/data";
import classNames from "classnames";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { getStringOrPlaceholder, maybe, renderCollection } from "../../../misc";
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
    colSku: {
      textAlign: "right",
      textOverflow: "ellipsis",
      width: 120
    },
    colTotal: {
      textAlign: "right",
      width: 120
    },
    infoLabel: {
      display: "inline-block"
    },
    infoLabelWithMargin: {
      marginBottom: theme.spacing()
    },
    infoRow: {
      padding: theme.spacing(2, 3)
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

const numberOfColumns = 5;

const OrderFulfillment: React.FC<OrderFulfillmentProps> = props => {
  const {
    fulfillment,
    orderNumber,
    onOrderFulfillmentCancel,
    onTrackingCodeAdd
  } = props;
  const classes = useStyles(props);

  const intl = useIntl();

  const lines =
    fulfillment?.status === FulfillmentStatus.REFUNDED
      ? mergeRepeatedOrderLines(fulfillment?.lines)
      : fulfillment?.lines;
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
                    : status === FulfillmentStatus.REFUNDED
                    ? intl.formatMessage(
                        {
                          defaultMessage: "Refunded ({quantity})",
                          description: "refunded fulfillment, section header"
                        },
                        {
                          quantity
                        }
                      )
                    : intl.formatMessage(
                        {
                          defaultMessage: "Cancelled ({quantity})",
                          description: "cancelled fulfillment, section header"
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
                status === FulfillmentStatus.FULFILLED
                  ? "success"
                  : status === FulfillmentStatus.REFUNDED
                  ? "unspecified"
                  : "error"
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
                    defaultMessage: "Cancel Fulfillment",
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
            <TableCell className={classes.colSku}>
              <FormattedMessage
                defaultMessage="SKU"
                description="ordered product sku"
              />
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
              <TableCell className={classes.colSku}>
                {line?.orderLine.productSku || <Skeleton />}
              </TableCell>
              <TableCell className={classes.colQuantity}>
                {line?.quantity || <Skeleton />}
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
          {(fulfillment?.warehouse || fulfillment?.trackingNumber) && (
            <TableRow>
              <TableCell className={classes.infoRow} colSpan={numberOfColumns}>
                <Typography color="textSecondary" variant="body2">
                  {fulfillment?.warehouse && (
                    <FormattedMessage
                      defaultMessage="Fulfilled from: {warehouseName}"
                      description="fulfillment group"
                      values={{
                        warehouseName: (
                          <Typography
                            className={classNames(classes.infoLabel, {
                              [classes.infoLabelWithMargin]: !!fulfillment?.trackingNumber
                            })}
                            color="textPrimary"
                            variant="body2"
                          >
                            {getStringOrPlaceholder(
                              fulfillment?.warehouse?.name
                            )}
                          </Typography>
                        )
                      }}
                    />
                  )}
                </Typography>
                <Typography color="textSecondary" variant="body2">
                  {fulfillment?.trackingNumber && (
                    <FormattedMessage
                      defaultMessage="Tracking Number: {trackingNumber}"
                      values={{
                        trackingNumber: (
                          <Typography
                            className={classes.infoLabel}
                            color="textPrimary"
                            variant="body2"
                          >
                            {fulfillment.trackingNumber}
                          </Typography>
                        )
                      }}
                    />
                  )}
                </Typography>
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
      {status === FulfillmentStatus.FULFILLED && fulfillment.trackingNumber && (
        <CardActions>
          <Button color="primary" onClick={onTrackingCodeAdd}>
            <FormattedMessage
              defaultMessage="Edit tracking"
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
