import { Button, Card, CardContent } from "@material-ui/core";
import CardTitle from "@saleor/components/CardTitle";
import { Hr } from "@saleor/components/Hr";
import Money, { subtractMoney } from "@saleor/components/Money";
import Skeleton from "@saleor/components/Skeleton";
import StatusLabel from "@saleor/components/StatusLabel";
import { makeStyles } from "@saleor/macaw-ui";
import OrderPaymentDetails from "@saleor/orders/components/OrderPaymentDetails";
import classNames from "classnames";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { maybe, transformOrderPaymentStatus } from "../../../misc";
import {
  OrderAction,
  OrderDiscountType,
  OrderStatus
} from "../../../types/globalTypes";
import { OrderDetails_order } from "../../types/OrderDetails";
import { isOverpaid } from "../OrderDetailsPage/utils";

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
    },
    paymentStatus: {
      display: "flex"
    },
    paymentStatusTitle: {
      marginRight: 15
    },
    disabled: {
      color: theme.palette.text.disabled
    },
    overpaid: {
      color: "#FE6E76",
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
  onPaymentCapture: (id: string) => void;
  onPaymentVoid: (id: string) => void;
}

const OrderPayment: React.FC<OrderPaymentProps> = props => {
  const {
    order,
    onCapture,
    onMarkAsPaid,
    onRefund,
    onVoid,
    onPaymentCapture,
    onPaymentVoid
  } = props;
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
  const payment = transformOrderPaymentStatus(
    maybe(() => order.paymentStatus),
    intl
  );
  const refundedAmount =
    order?.totalCaptured &&
    order?.total?.gross &&
    subtractMoney(order.totalCaptured, order.total.gross);
  return (
    <Card>
      <CardTitle
        title={
          maybe(() => order.paymentStatus) === undefined ? (
            <Skeleton />
          ) : (
            <div className={classes.paymentStatus}>
              <span className={classes.paymentStatusTitle}>
                <FormattedMessage
                  defaultMessage="Payment status"
                  description="capture payment, button"
                />
              </span>
              <StatusLabel label={payment.localized} status={payment.status} />
            </div>
          )
        }
        toolbar={
          maybe(() => order.status) !== OrderStatus.CANCELED && (
            <>
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
              {canCapture && (
                <Button color="primary" variant="text" onClick={onCapture}>
                  <FormattedMessage
                    defaultMessage="Capture"
                    description="capture payment, button"
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
            </>
          )
        }
      />
      <CardContent>
        <table className={classes.root}>
          <tbody>
            <tr className={classes.disabled}>
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
              <td className={classes.disabled}>
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
              <td className={classes.disabled}>
                {maybe(() => order.shippingMethodName) === undefined &&
                maybe(() => order.shippingPrice) === undefined ? (
                  <Skeleton />
                ) : order.shippingMethodName === null ? (
                  intl.formatMessage({
                    defaultMessage: "does not apply",
                    description: "order does not require shipping",
                    id: "orderPaymentShippingDoesNotApply"
                  })
                ) : (
                  order.shippingMethodName
                )}
              </td>
              <td className={classes.textRight}>
                {maybe(() => order.shippingPrice.gross) === undefined ? (
                  <Skeleton />
                ) : (
                  <Money money={order.shippingPrice.gross} />
                )}
              </td>
            </tr>
            {order?.discounts?.map(discount => (
              <tr key={discount.id}>
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
      {maybe(() => order.payments) !== undefined &&
        order.payments.map(payment => (
          <OrderPaymentDetails
            key={payment.id}
            payment={payment}
            onPaymentCapture={onPaymentCapture}
            onPaymentVoid={onPaymentVoid}
          />
        ))}

      <CardContent>
        <table className={classes.root}>
          <tbody>
            <tr>
              <td className={classes.totalRow}>
                <FormattedMessage
                  defaultMessage="Total preauthorized"
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
              <td
                className={
                  isOverpaid(order) ? classes.overpaid : classes.totalRow
                }
              >
                <FormattedMessage
                  defaultMessage="Total captured"
                  description="order payment"
                />
              </td>
              <td
                className={
                  isOverpaid(order)
                    ? classNames(classes.textRight, classes.overpaid)
                    : classes.textRight
                }
              >
                {maybe(() => order.totalCaptured.amount) === undefined ? (
                  <Skeleton />
                ) : (
                  <Money money={order.totalCaptured} />
                )}
              </td>
            </tr>
            <tr>
              <td className={classes.totalRow}>
                <FormattedMessage
                  defaultMessage="Total refunded"
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
              <td className={isOverpaid(order) ? classes.overpaid : undefined}>
                <FormattedMessage
                  defaultMessage="Outstanding Balance"
                  description="order payment"
                />
              </td>
              <td
                className={
                  isOverpaid(order)
                    ? classNames(classes.textRight, classes.overpaid)
                    : classes.textRight
                }
              >
                {maybe(
                  () => order.total.gross.amount && order.totalCaptured.amount
                ) === undefined ? (
                  <Skeleton />
                ) : (
                  <Money
                    money={subtractMoney(
                      order.total.gross,
                      order.totalCaptured
                    )}
                  />
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
};
OrderPayment.displayName = "OrderPayment";
export default OrderPayment;
