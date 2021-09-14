import { Button, Card, CardActions, CardContent } from "@material-ui/core";
import CardTitle from "@saleor/components/CardTitle";
import { Hr } from "@saleor/components/Hr";
import Money, { subtractMoney } from "@saleor/components/Money";
import Skeleton from "@saleor/components/Skeleton";
import StatusLabel from "@saleor/components/StatusLabel";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { maybe, transformPaymentStatus } from "../../../misc";
import {
  OrderAction,
  OrderDiscountType,
  OrderStatus
} from "../../../types/globalTypes";
import { OrderDetails_order } from "../../types/OrderDetails";
import messages from "./messages";
import { extractOrderGiftCardUsedAmount } from "./utils";

const useStyles = makeStyles(
  theme => ({
    root: {
      ...theme.typography.body1,
      lineHeight: 1.9,
      width: "100%"
    },
    textRight: {
      textAlign: "right"
    },
    totalRow: {
      fontWeight: 600
    }
  }),
  { name: "OrderPayment" }
);

interface OrderPaymentProps {
  order: OrderDetails_order;
  onCapture: () => void;
  onMarkAsPaid: () => void;
  onRefund: () => void;
  onVoid: () => void;
}

const OrderPayment: React.FC<OrderPaymentProps> = props => {
  const { order, onCapture, onMarkAsPaid, onRefund, onVoid } = props;
  const classes = useStyles(props);

  const intl = useIntl();

  const canCapture = maybe(() => order.actions, []).includes(
    OrderAction.CAPTURE
  );
  const canVoid = maybe(() => order.actions, []).includes(OrderAction.VOID);
  const canRefund = maybe(() => order.actions, []).includes(OrderAction.REFUND);
  const canMarkAsPaid = maybe(() => order.actions, []).includes(
    OrderAction.MARK_AS_PAID
  );
  const payment = transformPaymentStatus(
    maybe(() => order.paymentStatus),
    intl
  );
  const refundedAmount =
    order?.totalCaptured &&
    order?.total?.gross &&
    subtractMoney(order.totalCaptured, order.total.gross);

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
        <FormattedMessage {...messages.orderPaymentShippingDoesNotApply} />
      ) : (
        <FormattedMessage
          {...messages.orderPaymentClickAndCollectShippingMethod}
        />
      );
    }
    return order.shippingMethodName;
  };

  const usedGiftCardAmount = extractOrderGiftCardUsedAmount(order);

  return (
    <Card>
      <CardTitle
        title={
          maybe(() => order.paymentStatus) === undefined ? (
            <Skeleton />
          ) : (
            <StatusLabel label={payment.localized} status={payment.status} />
          )
        }
      />
      <CardContent>
        <table className={classes.root}>
          <tbody>
            <tr>
              <td>
                <FormattedMessage
                  defaultMessage="Subtotal"
                  description="order subtotal price"
                />
              </td>
              <td>
                {maybe(() => order.lines) === undefined ? (
                  <Skeleton />
                ) : (
                  <FormattedMessage
                    defaultMessage="{quantity} items"
                    description="ordered products"
                    values={{
                      quantity: order.lines
                        .map(line => line.quantity)
                        .reduce((curr, prev) => prev + curr, 0)
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
                <FormattedMessage defaultMessage="Taxes" />
              </td>
              <td>
                {maybe(() => order.total.tax) === undefined ? (
                  <Skeleton />
                ) : order.total.tax.amount > 0 ? (
                  intl.formatMessage({
                    defaultMessage: "VAT included",
                    description: "vat included in order price"
                  })
                ) : (
                  intl.formatMessage({
                    defaultMessage: "does not apply",
                    description: "vat not included in order price",
                    id: "orderPaymentVATDoesNotApply"
                  })
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
                <FormattedMessage
                  defaultMessage="Shipping"
                  description="order shipping method name"
                />
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
                  <FormattedMessage
                    defaultMessage="Discount"
                    description="order discount"
                  />
                </td>
                <td>
                  {discount.type === OrderDiscountType.MANUAL ? (
                    <FormattedMessage
                      defaultMessage="Staff added"
                      description="staff added type order discount"
                    />
                  ) : (
                    <FormattedMessage
                      defaultMessage="Voucher"
                      description="voucher type order discount"
                    />
                  )}
                </td>
                <td className={classes.textRight}>
                  -<Money money={discount.amount} />
                </td>
              </tr>
            ))}
            <tr className={classes.totalRow}>
              <td>
                <FormattedMessage
                  defaultMessage="Total"
                  description="order total price"
                />
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
                    defaultMessage="Paid with Gift Card"
                    description="order payment"
                  />
                </td>
                <td className={classes.textRight}>
                  <Money
                    money={{
                      amount: usedGiftCardAmount,
                      currency: order?.total?.gross?.currency
                    }}
                  />
                </td>
              </tr>
            )}
            <tr>
              <td>
                <FormattedMessage
                  defaultMessage="Preauthorized amount"
                  description="order payment"
                />
              </td>
              <td className={classes.textRight}>
                {maybe(() => order.totalAuthorized.amount) === undefined ? (
                  <Skeleton />
                ) : (
                  <Money money={order.totalAuthorized} />
                )}
              </td>
            </tr>
            <tr>
              <td>
                <FormattedMessage
                  defaultMessage="Captured amount"
                  description="order payment"
                />
              </td>
              <td className={classes.textRight}>
                {maybe(() => order.totalCaptured.amount) === undefined ? (
                  <Skeleton />
                ) : (
                  <Money money={order.totalCaptured} />
                )}
              </td>
            </tr>
            <tr>
              <td>
                <FormattedMessage
                  defaultMessage="Refunded amount"
                  description="order payment"
                />
              </td>
              <td className={classes.textRight}>
                {refundedAmount?.amount === undefined ? (
                  <Skeleton />
                ) : (
                  <Money money={refundedAmount} />
                )}
              </td>
            </tr>
            <tr className={classes.totalRow}>
              <td>
                <FormattedMessage
                  defaultMessage="Outstanding Balance"
                  description="order payment"
                />
              </td>
              <td className={classes.textRight}>
                {maybe(
                  () => order.total.gross.amount && order.totalCaptured.amount
                ) === undefined ? (
                  <Skeleton />
                ) : (
                  <Money
                    money={subtractMoney(
                      order.totalCaptured,
                      order.total.gross
                    )}
                  />
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </CardContent>
      {maybe(() => order.status) !== OrderStatus.CANCELED &&
        (canCapture || canRefund || canVoid || canMarkAsPaid) && (
          <>
            <Hr />
            <CardActions>
              {canCapture && (
                <Button color="primary" variant="text" onClick={onCapture}>
                  <FormattedMessage
                    defaultMessage="Capture"
                    description="capture payment, button"
                  />
                </Button>
              )}
              {canRefund && (
                <Button
                  color="primary"
                  variant="text"
                  onClick={onRefund}
                  data-test-id="refund-button"
                >
                  <FormattedMessage
                    defaultMessage="Refund"
                    description="button"
                  />
                </Button>
              )}
              {canVoid && (
                <Button color="primary" variant="text" onClick={onVoid}>
                  <FormattedMessage
                    defaultMessage="Void"
                    description="void payment, button"
                  />
                </Button>
              )}
              {canMarkAsPaid && (
                <Button color="primary" variant="text" onClick={onMarkAsPaid}>
                  <FormattedMessage
                    defaultMessage="Mark as paid"
                    description="order, button"
                  />
                </Button>
              )}
            </CardActions>
          </>
        )}
    </Card>
  );
};
OrderPayment.displayName = "OrderPayment";
export default OrderPayment;
