import { Button, Card, CardActions, TableBody } from "@material-ui/core";
import CardSpacer from "@saleor/components/CardSpacer";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import { makeStyles, Tooltip } from "@saleor/macaw-ui";
import { renderCollection } from "@saleor/misc";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { OrderDetails_order_lines } from "../../types/OrderDetails";
import TableHeader from "../OrderProductsCardElements/OrderProductsCardHeader";
import TableLine from "../OrderProductsCardElements/OrderProductsTableRow";
import CardTitle from "../OrderReturnPage/OrderReturnRefundItemsCard/CardTitle";
import { messages } from "./messages";

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
  const intl = useIntl();

  if (!lines.length) {
    return null;
  }

  let isDeleted = false;
  for (const line of lines) {
    if (!line.variant) {
      isDeleted = true;
      break;
    }
  }

  return (
    <>
      <Card>
        <CardTitle withStatus status="unfulfilled" />
        <ResponsiveTable className={classes.table}>
          <TableHeader />
          <TableBody>
            {renderCollection(lines, line => (
              <TableLine isOrderLine line={line} isFulfilled={false} />
            ))}
          </TableBody>
        </ResponsiveTable>
        {canFulfill && (
          <CardActions>
            <Tooltip
              title={intl.formatMessage(messages.deletedVariantDetected)}
              variant={"info"}
              placement={"left"}
            >
              <div>
                <Button
                  disabled={isDeleted}
                  variant="text"
                  color="primary"
                  onClick={onFulfill}
                >
                  <FormattedMessage
                    defaultMessage="Fulfill"
                    description="button"
                  />
                </Button>
              </div>
            </Tooltip>
          </CardActions>
        )}
      </Card>
      <CardSpacer />
    </>
  );
};

export default OrderUnfulfilledProductsCard;
