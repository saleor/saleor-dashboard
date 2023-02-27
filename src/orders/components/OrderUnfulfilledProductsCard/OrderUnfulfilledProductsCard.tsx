import { Button } from "@dashboard/components/Button";
import CardSpacer from "@dashboard/components/CardSpacer";
import ResponsiveTable from "@dashboard/components/ResponsiveTable";
import { OrderLineFragment } from "@dashboard/graphql";
import { commonMessages } from "@dashboard/intl";
import { renderCollection } from "@dashboard/misc";
import { Card, CardActions, CardContent, TableBody, Typography } from "@material-ui/core";
import React from "react";
import { FormattedMessage } from "react-intl";

import OrderCardTitle from "../OrderCardTitle";
import TableHeader from "../OrderProductsCardElements/OrderProductsCardHeader";
import TableLine from "../OrderProductsCardElements/OrderProductsTableRow";
import { useStyles } from "./styles";

interface OrderUnfulfilledProductsCardProps {
  showFulfillmentAction: boolean;
  notAllowedToFulfillUnpaid: boolean;
  lines: OrderLineFragment[];
  onFulfill: () => void;
}

const OrderUnfulfilledProductsCard: React.FC<OrderUnfulfilledProductsCardProps> = props => {
  const { showFulfillmentAction, notAllowedToFulfillUnpaid, lines, onFulfill } = props;
  const classes = useStyles();

  if (!lines.length) {
    return null;
  }

  return (
    <>
      <Card>
        <OrderCardTitle
          lines={lines}
          withStatus
          status="unfulfilled"
          className={classes.cardTitle}
        />
        <CardContent>
          <ResponsiveTable className={classes.table}>
            <TableHeader />
            <TableBody>
              {renderCollection(lines, line => (
                <TableLine key={line.id} isOrderLine line={line} />
              ))}
            </TableBody>
          </ResponsiveTable>
          {showFulfillmentAction && (
            <CardActions className={classes.actions}>
              <Button variant="primary" onClick={onFulfill} disabled={notAllowedToFulfillUnpaid}>
                <FormattedMessage id="/Xwjww" defaultMessage="Fulfill" description="button" />
              </Button>
              {notAllowedToFulfillUnpaid && (
                <Typography color="error" variant="caption">
                  <FormattedMessage {...commonMessages.cannotFullfillUnpaidOrder} />
                </Typography>
              )}
            </CardActions>
          )}
        </CardContent>
      </Card>
      <CardSpacer />
    </>
  );
};

export default OrderUnfulfilledProductsCard;
