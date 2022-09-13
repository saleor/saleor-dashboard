import { Card, CardContent } from "@material-ui/core";
import HorizontalSpacer from "@saleor/apps/components/HorizontalSpacer";
import { Button } from "@saleor/components/Button";
import CardTitle from "@saleor/components/CardTitle";
import { Hr } from "@saleor/components/Hr";
import Money from "@saleor/components/Money";
import Skeleton from "@saleor/components/Skeleton";
import {
  OrderAction,
  OrderDetailsFragment,
  OrderDiscountType,
  OrderStatus,
} from "@saleor/graphql";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { maybe } from "../../../misc";
import { orderSummaryMessages, paymentButtonMessages } from "./messages";
import {
  extractOrderGiftCardUsedAmount,
  extractOutstandingBalance,
} from "./utils";

const useStyles = makeStyles(
  theme => ({
    header: {
      display: "flex",
      justifyContent: "space-between",
    },
    root: {
      ...theme.typography.body1,
      lineHeight: 1.9,
      width: "100%",
    },
    textRight: {
      textAlign: "right",
    },
    totalRow: {
      fontWeight: 600,
    },
    titleContainer: {
      display: "flex",
    },
  }),
  { name: "OrderPayment" },
);

interface OrderPaymentProps {
  order: OrderDetailsFragment;
  onCapture: () => void;
  onMarkAsPaid: () => void;
  onRefund: () => void;
  onVoid: () => void;
}

const OrderSummaryCard: React.FC<OrderPaymentProps> = props => {
  const { order, onCapture, onMarkAsPaid, onRefund, onVoid } = props;
  const classes = useStyles(props);

  const intl = useIntl();

  const canCapture = maybe(() => order.actions, []).includes(
    OrderAction.CAPTURE,
  );
  const canVoid = maybe(() => order.actions, []).includes(OrderAction.VOID);
  const canRefund = maybe(() => order.actions, []).includes(OrderAction.REFUND);
  const canMarkAsPaid = maybe(() => order.actions, []).includes(
    OrderAction.MARK_AS_PAID,
  );

  const outstandingBalance = extractOutstandingBalance(order);
  const usedGiftCardAmount = extractOrderGiftCardUsedAmount(order);

  const getDeliveryMethodName = order => {
    if (
      order?.shippingMethodName === undefined &&
      order?.shippingPrice === undefined &&
      order?.collectionPointName === undefined
    ) {
      return <Skeleton />;
    }

    if (order.shippingMethodName === null) {
      return order.collectionPointName == null ? (
        <FormattedMessage {...orderSummaryMessages.shippingDoesNotApply} />
      ) : (
        <FormattedMessage
          {...orderSummaryMessages.clickAndCollectShippingMethod}
        />
      );
    }
    return order.shippingMethodName;
  };

  return (
    <Card>
      <CardTitle
        title={
          !order?.paymentStatus ? (
            <Skeleton />
          ) : (
            <div className={classes.header}>
              <div className={classes.titleContainer}>
                <FormattedMessage {...orderSummaryMessages.paymentTitle} />
                <HorizontalSpacer spacing={2} />
              </div>
              {maybe(() => order.status) !== OrderStatus.CANCELED &&
                (canCapture || canRefund || canVoid || canMarkAsPaid) && (
                  <div>
                    {canCapture && (
                      <Button variant="tertiary" onClick={onCapture}>
                        <FormattedMessage {...paymentButtonMessages.capture} />
                      </Button>
                    )}
                    {canRefund && (
                      <Button
                        variant="tertiary"
                        onClick={onRefund}
                        data-test-id="refund-button"
                      >
                        <FormattedMessage {...paymentButtonMessages.refund} />
                      </Button>
                    )}
                    {canVoid && (
                      <Button variant="tertiary" onClick={onVoid}>
                        <FormattedMessage {...paymentButtonMessages.void} />
                      </Button>
                    )}
                    {canMarkAsPaid && (
                      <Button variant="tertiary" onClick={onMarkAsPaid}>
                        <FormattedMessage
                          {...paymentButtonMessages.markAsPaid}
                        />
                      </Button>
                    )}
                  </div>
                )}
            </div>
          )
        }
      />
      <CardContent>
        <table className={classes.root}>
          <tbody>
            <tr>
              <td>
                <FormattedMessage {...orderSummaryMessages.subtotal} />
              </td>
              <td>
                {maybe(() => order.lines) === undefined ? (
                  <Skeleton />
                ) : (
                  <FormattedMessage
                    {...orderSummaryMessages.itemCount}
                    values={{
                      quantity: order.lines
                        .map(line => line.quantity)
                        .reduce((curr, prev) => prev + curr, 0),
                    }}
                  />
                )}
              </td>
              <td className={classes.textRight}>
                {maybe(() => order.subtotal.gross) === undefined ? (
                  <Skeleton />
                ) : (
                  <Money money={order.subtotal.gross} />
                )}
              </td>
            </tr>
            <tr>
              <td>
                <FormattedMessage {...orderSummaryMessages.taxes} />
              </td>
              <td>
                {maybe(() => order.total.tax) === undefined ? (
                  <Skeleton />
                ) : order.total.tax.amount > 0 ? (
                  intl.formatMessage(orderSummaryMessages.vatIncluded)
                ) : (
                  intl.formatMessage(orderSummaryMessages.vatNotIncluded)
                )}
              </td>
              <td className={classes.textRight}>
                {maybe(() => order.total.tax) === undefined ? (
                  <Skeleton />
                ) : (
                  <Money money={order.total.tax} />
                )}
              </td>
            </tr>
            <tr>
              <td>
                <FormattedMessage {...orderSummaryMessages.shipping} />
              </td>
              <td>{getDeliveryMethodName(order)}</td>
              <td className={classes.textRight}>
                {maybe(() => order.shippingPrice.gross) === undefined ? (
                  <Skeleton />
                ) : (
                  <Money money={order.shippingPrice.gross} />
                )}
              </td>
            </tr>
            {order?.discounts?.map(discount => (
              <tr>
                <td>
                  <FormattedMessage {...orderSummaryMessages.discount} />
                </td>
                <td>
                  {discount.type === OrderDiscountType.MANUAL ? (
                    <FormattedMessage {...orderSummaryMessages.staffAdded} />
                  ) : (
                    <FormattedMessage {...orderSummaryMessages.voucher} />
                  )}
                </td>
                <td className={classes.textRight}>
                  -<Money money={discount.amount} />
                </td>
              </tr>
            ))}
            <tr className={classes.totalRow}>
              <td>
                <FormattedMessage {...orderSummaryMessages.total} />
              </td>
              <td />
              <td className={classes.textRight}>
                {maybe(() => order.total.gross) === undefined ? (
                  <Skeleton />
                ) : (
                  <Money money={order.total.gross} />
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </CardContent>
      <Hr />
      <CardContent>
        <table className={classes.root}>
          <tbody>
            {!!usedGiftCardAmount && (
              <tr>
                <td>
                  <FormattedMessage
                    {...orderSummaryMessages.paidWithGiftCard}
                  />
                </td>
                <td className={classes.textRight}>
                  <Money
                    money={{
                      amount: usedGiftCardAmount,
                      currency: order?.total?.gross?.currency,
                    }}
                  />
                </td>
              </tr>
            )}
            <tr className={classes.totalRow}>
              <td>
                <FormattedMessage {...orderSummaryMessages.outstanding} />
              </td>
              <td className={classes.textRight}>
                {outstandingBalance?.amount === undefined ? (
                  <Skeleton />
                ) : (
                  <Money money={outstandingBalance} />
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
};
OrderSummaryCard.displayName = "OrderPayment";
export default OrderSummaryCard;
