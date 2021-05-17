import { Button, Card, CardActions, TableBody } from "@material-ui/core";
import CardSpacer from "@saleor/components/CardSpacer";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import { renderCollection } from "@saleor/misc";
import { makeStyles } from "@saleor/theme";
import React from "react";
import { FormattedMessage } from "react-intl";

import { OrderDetails_order_lines } from "../../types/OrderDetails";
import TableHeader from "../OrderProductsCardElements/OrderProductsCardHeader";
import TableLine from "../OrderProductsCardElements/OrderProductsTableRow";
import CardTitle from "../OrderReturnPage/OrderReturnRefundItemsCard/CardTitle";

const useStyles = makeStyles(
  () => ({
    table: {
      tableLayout: "fixed"
    }
  }),
  { name: "OrderUnfulfilledItems" }
);

interface OrderUnfulfilledProductsCardProps {
  canFulfill: boolean;
  lines: OrderDetails_order_lines[];
  onFulfill: () => void;
}

const OrderUnfulfilledProductsCard: React.FC<OrderUnfulfilledProductsCardProps> = props => {
  const { canFulfill, lines, onFulfill } = props;
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
        {canFulfill && (
          <CardActions>
            <Button variant="text" color="primary" onClick={onFulfill}>
              <FormattedMessage defaultMessage="Fulfill" description="button" />
            </Button>
          </CardActions>
        )}
      </Card>
      <CardSpacer />
    </>
  );
};

export default OrderUnfulfilledProductsCard;
