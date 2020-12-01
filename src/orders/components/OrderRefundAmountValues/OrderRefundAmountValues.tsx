import { makeStyles } from "@material-ui/core";
import Money, { IMoney } from "@saleor/components/Money";
import Skeleton from "@saleor/components/Skeleton";
import React from "react";
import { FormattedMessage } from "react-intl";

const useStyles = makeStyles(
  theme => ({
    highlightedRow: {
      fontWeight: 600
    },
    root: {
      ...theme.typography.body1,
      lineHeight: 1.9,
      width: "100%"
    },
    textRight: {
      minWidth: 30,
      textAlign: "right"
    }
  }),
  { name: "OrderRefundAmountValues" }
);

export interface OrderRefundAmountValuesProps {
  authorizedAmount: IMoney;
  shipmentCost?: IMoney;
  selectedProductsValue?: IMoney;
  previouslyRefunded: IMoney;
  maxRefund: IMoney;
  proposedRefundAmount?: IMoney;
  refundTotalAmount?: IMoney;
}

const OrderRefundAmountValues: React.FC<OrderRefundAmountValuesProps> = ({
  authorizedAmount,
  shipmentCost,
  selectedProductsValue,
  previouslyRefunded,
  maxRefund,
  proposedRefundAmount,
  refundTotalAmount
}) => {
  const classes = useStyles({});

  return (
    <table className={classes.root}>
      <tbody>
        <tr>
          <td>
            <FormattedMessage
              defaultMessage="Authorized Amount"
              description="order refund amount"
            />
          </td>
          <td className={classes.textRight}>
            {authorizedAmount?.amount !== undefined ? (
              <Money money={authorizedAmount} />
            ) : (
              <Skeleton />
            )}
          </td>
        </tr>
        {shipmentCost?.amount !== undefined && (
          <tr>
            <td>
              <FormattedMessage
                defaultMessage="Shipment cost"
                description="order refund amount"
              />
            </td>
            <td className={classes.textRight}>
              <Money money={shipmentCost} />
            </td>
          </tr>
        )}
        {selectedProductsValue?.amount !== undefined && (
          <tr>
            <td>
              <FormattedMessage
                defaultMessage="Selected products value"
                description="order refund amount"
              />
            </td>
            <td className={classes.textRight}>
              <Money money={selectedProductsValue} />
            </td>
          </tr>
        )}
        <tr>
          <td>
            <FormattedMessage
              defaultMessage="Previously refunded"
              description="order refund amount"
            />
          </td>
          <td className={classes.textRight}>
            {previouslyRefunded?.amount !== undefined ? (
              <>
                <Money money={previouslyRefunded} />
              </>
            ) : (
              <Skeleton />
            )}
          </td>
        </tr>
        <tr className={classes.highlightedRow}>
          <td>
            <FormattedMessage
              defaultMessage="Max Refund"
              description="order refund amount"
            />
          </td>
          <td className={classes.textRight}>
            {maxRefund?.amount !== undefined ? (
              <Money money={maxRefund} />
            ) : (
              <Skeleton />
            )}
          </td>
        </tr>
        {proposedRefundAmount?.amount !== undefined && (
          <tr className={classes.highlightedRow}>
            <td>
              <FormattedMessage
                defaultMessage="Proposed refund amount"
                description="order refund amount"
              />
            </td>
            <td className={classes.textRight}>
              <Money money={proposedRefundAmount} />
            </td>
          </tr>
        )}
        {refundTotalAmount?.amount !== undefined && (
          <tr className={classes.highlightedRow}>
            <td>
              <FormattedMessage
                defaultMessage="Refund total amount"
                description="order refund amount"
              />
            </td>
            <td className={classes.textRight}>
              <Money money={refundTotalAmount} />
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};
OrderRefundAmountValues.displayName = "OrderRefundAmountValues";
export default OrderRefundAmountValues;
