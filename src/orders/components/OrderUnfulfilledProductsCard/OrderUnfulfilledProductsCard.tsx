import { Card, CardActions, TableBody } from "@material-ui/core";
import CardSpacer from "@saleor/components/CardSpacer";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import { Button, makeStyles, Tooltip } from "@saleor/macaw-ui";
import { renderCollection } from "@saleor/misc";
import React from "react";
import { useIntl } from "react-intl";

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

  const noProductsAvailable = lines.every(el => !el.variant);

  return (
    <>
      <Card>
        <CardTitle withStatus status="unfulfilled" />
        <ResponsiveTable className={classes.table}>
          <TableHeader />
          <TableBody>
            {renderCollection(lines, line => (
              <TableLine
                key={line.id}
                isOrderLine
                line={line}
                isFulfilled={false}
              />
            ))}
          </TableBody>
        </ResponsiveTable>
        {canFulfill && (
          <CardActions>
            {noProductsAvailable ? (
              <Tooltip
                title={intl.formatMessage(messages.deletedVariantDetected)}
                variant="error"
                placement={"left"}
              >
                <div>
                  <Button disabled variant="tertiary" onClick={onFulfill}>
                    {intl.formatMessage(messages.fulfillButton)}
                  </Button>
                </div>
              </Tooltip>
            ) : (
              <Button variant="tertiary" onClick={onFulfill}>
                {intl.formatMessage(messages.fulfillButton)}
              </Button>
            )}
          </CardActions>
        )}
      </Card>
      <CardSpacer />
    </>
  );
};

export default OrderUnfulfilledProductsCard;
