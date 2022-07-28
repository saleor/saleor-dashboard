import { Card, CardActions, TableBody, Typography } from "@material-ui/core";
import { Button } from "@saleor/components/Button";
import CardSpacer from "@saleor/components/CardSpacer";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import Skeleton from "@saleor/components/Skeleton";
import { OrderLineFragment, WarehouseFragment } from "@saleor/graphql";
import { commonMessages } from "@saleor/intl";
import { ChevronIcon, IconButton } from "@saleor/macaw-ui";
import { renderCollection } from "@saleor/misc";
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
  selectedWarehouse: WarehouseFragment;
  onWarehouseChange: () => null;
}

const OrderUnfulfilledProductsCard: React.FC<OrderUnfulfilledProductsCardProps> = props => {
  const {
    showFulfillmentAction,
    notAllowedToFulfillUnpaid,
    lines,
    onFulfill,
    selectedWarehouse,
    onWarehouseChange,
  } = props;
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
          toolbar={
            <IconButton
              onClick={onWarehouseChange}
              className={classes.toolbarButton}
              data-test-id="select-warehouse-button"
            >
              <div className={classes.toolbarButtonContent}>
                <div>{selectedWarehouse?.name ?? <Skeleton />}</div>
                <ChevronIcon />
              </div>
            </IconButton>
          }
        />
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
            <Button
              variant="primary"
              onClick={onFulfill}
              disabled={notAllowedToFulfillUnpaid}
            >
              <FormattedMessage
                id="/Xwjww"
                defaultMessage="Fulfill"
                description="button"
              />
            </Button>
            {notAllowedToFulfillUnpaid && (
              <Typography color="error" variant="caption">
                <FormattedMessage
                  {...commonMessages.cannotFullfillUnpaidOrder}
                />
              </Typography>
            )}
          </CardActions>
        )}
      </Card>
      <CardSpacer />
    </>
  );
};

export default OrderUnfulfilledProductsCard;
