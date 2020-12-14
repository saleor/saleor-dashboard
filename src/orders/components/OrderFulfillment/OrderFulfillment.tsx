import Card from "@material-ui/core/Card";
import { makeStyles } from "@material-ui/core/styles";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import CardMenu from "@saleor/components/CardMenu";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import { mergeRepeatedOrderLines } from "@saleor/orders/utils/data";
import classNames from "classnames";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { getStringOrPlaceholder, maybe, renderCollection } from "../../../misc";
import { FulfillmentStatus } from "../../../types/globalTypes";
import { OrderDetails_order_fulfillments } from "../../types/OrderDetails";
import CardTitle from "../OrderReturnPage/OrderReturnRefundItemsCard/CardTitle";
import FulfilledActionButtons from "./FulfilledActionButtons";
import TableHeader from "./TableHeader";
import TableLine from "./TableLine";

const useStyles = makeStyles(
  theme => ({
    infoLabel: {
      display: "inline-block"
    },
    infoLabelWithMargin: {
      marginBottom: theme.spacing()
    },
    infoRow: {
      padding: theme.spacing(2, 3)
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

  if (!fulfillment) {
    return null;
  }

  const getLines = () => {
    const statusesToMergeLines = [
      FulfillmentStatus.REFUNDED,
      FulfillmentStatus.REFUNDED_AND_RETURNED,
      FulfillmentStatus.RETURNED
    ];

    if (statusesToMergeLines.includes(fulfillment?.status)) {
      return mergeRepeatedOrderLines(fulfillment.lines);
    }

    return fulfillment?.lines || [];
  };

  return (
    <Card>
      <CardTitle
        withStatus
        lines={fulfillment?.lines}
        fulfillment={fulfillment}
        orderNumber={orderNumber}
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
        <TableHeader />
        <TableBody>
          {renderCollection(getLines(), line => (
            <TableLine line={line} />
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
      <FulfilledActionButtons
        status={fulfillment?.status}
        trackingNumber={fulfillment?.trackingNumber}
        onTrackingCodeAdd={onTrackingCodeAdd}
      />
    </Card>
  );
};

export default OrderFulfillment;
