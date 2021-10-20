import { Card, CardContent } from "@material-ui/core";
import CardTitle from "@saleor/components/CardTitle";
import { Hr } from "@saleor/components/Hr";
import Money, { subtractMoney } from "@saleor/components/Money";
import Skeleton from "@saleor/components/Skeleton";
import StatusLabel from "@saleor/components/StatusLabel";
import OrderPaymentDetails from "@saleor/orders/components/OrderPaymentDetails";
import classNames from "classnames";
import React from "react";
import { useIntl } from "react-intl";

import { transformOrderPaymentStatus } from "../../../misc";
import { OrderDiscountType, OrderStatus } from "../../../types/globalTypes";
import { OrderDetails_order } from "../../types/OrderDetails";
import { isOverpaid } from "../OrderDetailsPage/utils";
import OrderPaymentToolbar from "../OrderPaymentToolbar";
import { orderPaymentMessages as messages } from "./messages";
import { useStyles } from "./styles";

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

  const payment = transformOrderPaymentStatus(order?.paymentStatus, intl);
  const refundedAmount =
    order?.totalCaptured &&
    order?.total?.gross &&
    subtractMoney(order.totalCaptured, order.total.gross);

  const isOrderOverpaid = isOverpaid(order);

  return (
    <Card>
      <CardTitle
        title={
          (order?.paymentStatus && (
            <div className={classes.paymentStatus}>
              <span className={classes.paymentStatusTitle}>
                {intl.formatMessage(messages.paymentStatus)}
              </span>
              <StatusLabel label={payment.localized} status={payment.status} />
            </div>
          )) || <Skeleton />
        }
        toolbar={
          order?.status !== OrderStatus.CANCELED && (
            <OrderPaymentToolbar
              order={order}
              onCapture={onCapture}
              onMarkAsPaid={onMarkAsPaid}
              onRefund={onRefund}
              onVoid={onVoid}
            />
          )
        }
      />
      <CardContent>
        <table className={classes.root}>
          <tbody>
            <tr className={classes.disabled}>
              <td>{intl.formatMessage(messages.subtotal)}</td>
              <td>
                {(order?.lines &&
                  intl.formatMessage(messages.subtotalQuantity, {
                    quantity: order.lines
                      .map(line => line.quantity)
                      .reduce((curr, prev) => prev + curr, 0)
                  })) || <Skeleton />}
              </td>
              <td className={classes.textRight}>
                {(order?.subtotal.gross && (
                  <Money money={order.subtotal.gross} />
                )) || <Skeleton />}
              </td>
            </tr>
            <tr>
              <td>{intl.formatMessage(messages.taxes)}</td>
              <td className={classes.disabled}>
                {(order &&
                  intl.formatMessage(
                    order.total.tax.amount > 0
                      ? messages.vatIncluded
                      : messages.vatNotIncluded
                  )) || <Skeleton />}
              </td>
              <td className={classes.textRight}>
                {(order?.total.tax && <Money money={order.total.tax} />) || (
                  <Skeleton />
                )}
              </td>
            </tr>
            <tr>
              <td>{intl.formatMessage(messages.shipping)}</td>
              <td className={classes.disabled}>
                {(order &&
                  ((order.shippingMethodName === null &&
                    intl.formatMessage(messages.shippingNotIncluded)) ||
                    order.shippingMethodName)) || <Skeleton />}
              </td>
              <td className={classes.textRight}>
                {(order?.shippingPrice.gross && (
                  <Money money={order.shippingPrice.gross} />
                )) || <Skeleton />}
              </td>
            </tr>
            {order?.discounts?.map(discount => (
              <tr key={discount.id}>
                <td>{intl.formatMessage(messages.discount)}</td>
                <td>
                  {intl.formatMessage(
                    discount.type === OrderDiscountType.MANUAL
                      ? messages.discountStaffAdded
                      : messages.discountVoucher
                  )}
                </td>
                <td className={classes.textRight}>
                  -<Money money={discount.amount} />
                </td>
              </tr>
            ))}
            <tr className={classes.totalRow}>
              <td>{intl.formatMessage(messages.total)}</td>
              <td />
              <td className={classes.textRight}>
                {(order?.total.gross && (
                  <Money money={order.total.gross} />
                )) || <Skeleton />}
              </td>
            </tr>
          </tbody>
        </table>
      </CardContent>

      <Hr />
      {order?.payments?.map(payment => (
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
                {intl.formatMessage(messages.totalPreauthorized)}
              </td>
              <td className={classes.textRight}>
                {(order?.totalAuthorized && (
                  <Money money={order.totalAuthorized} />
                )) || <Skeleton />}
              </td>
            </tr>
            <tr>
              <td
                className={
                  isOrderOverpaid ? classes.overpaid : classes.totalRow
                }
              >
                {intl.formatMessage(messages.totalCaptured)}
              </td>
              <td
                className={classNames(classes.textRight, {
                  [classes.overpaid]: isOrderOverpaid
                })}
              >
                {(order?.totalCaptured && (
                  <Money money={order.totalCaptured} />
                )) || <Skeleton />}
              </td>
            </tr>
            <tr>
              <td className={classes.totalRow}>
                {intl.formatMessage(messages.totalRefunded)}
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
              <td
                className={classNames({ [classes.overpaid]: isOrderOverpaid })}
              >
                {intl.formatMessage(messages.outstandingBalance)}
              </td>
              <td
                className={classNames(classes.textRight, {
                  [classes.overpaid]: isOrderOverpaid
                })}
              >
                {(order?.total.gross && order?.totalCaptured && (
                  <Money
                    money={subtractMoney(
                      order.total.gross,
                      order.totalCaptured
                    )}
                  />
                )) || <Skeleton />}
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
