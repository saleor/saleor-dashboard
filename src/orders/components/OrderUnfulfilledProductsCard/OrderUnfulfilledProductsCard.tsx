import { Card, CardActions, TableBody, Typography } from "@material-ui/core";
import CardSpacer from "@saleor/components/CardSpacer";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import { commonMessages } from "@saleor/intl";
import { Button, makeStyles } from "@saleor/macaw-ui";
import { renderCollection } from "@saleor/misc";
import React from "react";
import { FormattedMessage } from "react-intl";

import { OrderDetails_order_lines } from "../../types/OrderDetails";
import TableHeader from "../OrderProductsCardElements/OrderProductsCardHeader";
import TableLine from "../OrderProductsCardElements/OrderProductsTableRow";
import CardTitle from "../OrderReturnPage/OrderReturnRefundItemsCard/CardTitle";

const useStyles = makeStyles(
  theme => ({
    actions: {
      flexDirection: "row-reverse",
      padding: theme.spacing(2, 3)
    },
    table: {
      "& td, & th": {
        "&:not(:first-child):not(:last-child)": {
          paddingLeft: theme.spacing(1),
          paddingRight: theme.spacing(1)
        }
      },
      tableLayout: "fixed"
    }
  }),
  { name: "OrderUnfulfilledItems" }
);

interface OrderUnfulfilledProductsCardProps {
  showFulfillmentAction: boolean;
  notAllowedToFulfillUnpaid: boolean;
  lines: OrderDetails_order_lines[];
  onFulfill: () => void;
}

const OrderUnfulfilledProductsCard: React.FC<OrderUnfulfilledProductsCardProps> = props => {
  const {
    showFulfillmentAction,
    notAllowedToFulfillUnpaid,
    lines,
    onFulfill
  } = props;
  const classes = useStyles({});

  if (!lines.length) {
    return null;
  }

  return (
    <>
      <Card>
        <CardTitle withStatus status="unfulfilled" />
        <ResponsiveTable className={classes.table}>
          <TableHeader />
          <TableBody>
            {renderCollection(lines, line => (
              <TableLine isOrderLine line={line} />
            ))}
          </TableBody>
        </ResponsiveTable>
        {showFulfillmentAction && (
          <CardActions>
            <Button
              variant="tertiary"
              onClick={onFulfill}
              disabled={notAllowedToFulfillUnpaid}
            >
              <FormattedMessage defaultMessage="Fulfill" description="button" />
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
