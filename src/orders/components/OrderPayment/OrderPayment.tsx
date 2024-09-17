import { Button } from "@dashboard/components/Button";
import { DashboardCard } from "@dashboard/components/Card";
import HorizontalSpacer from "@dashboard/components/HorizontalSpacer";
import Money from "@dashboard/components/Money";
import { Pill } from "@dashboard/components/Pill";
import { OrderAction, OrderDetailsFragment, OrderStatus } from "@dashboard/graphql";
import { getDiscountTypeLabel } from "@dashboard/orders/utils/data";
import { Divider, Skeleton, sprinkles } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { transformPaymentStatus } from "../../../misc";
import { OrderUsedGiftCards } from "../OrderUsedGiftCards";
import { orderPaymentMessages, paymentButtonMessages } from "./messages";
import { useStyles } from "./styles";
import {
  extractOrderGiftCardUsedAmount,
  extractRefundedAmount,
  getDiscountAmount,
  obtainUsedGifrcards,
} from "./utils";

interface OrderPaymentProps {
  order: OrderDetailsFragment;
  onCapture: () => void;
  onMarkAsPaid: () => void;
  onRefund: () => void;
  onVoid: () => void;
}

const OrderPayment: React.FC<OrderPaymentProps> = props => {
  const { order, onCapture, onMarkAsPaid, onRefund, onVoid } = props;
  const classes = useStyles(props);
  const intl = useIntl();
  const canCapture = (order?.actions ?? []).includes(OrderAction.CAPTURE);
  const canVoid = (order?.actions ?? []).includes(OrderAction.VOID);
  const canRefund = (order?.actions ?? []).includes(OrderAction.REFUND);
  const canMarkAsPaid = (order?.actions ?? []).includes(OrderAction.MARK_AS_PAID);
  const payment = transformPaymentStatus(order?.paymentStatus, intl);
  const refundedAmount = extractRefundedAmount(order);
  const usedGiftCardAmount = extractOrderGiftCardUsedAmount(order);
  const usedGiftcards = obtainUsedGifrcards(order);

  const getDeliveryMethodName = (order: OrderDetailsFragment) => {
    if (
      order?.shippingMethodName === undefined &&
      order?.shippingPrice === undefined &&
      order?.collectionPointName === undefined
    ) {
      return <Skeleton />;
    }

    if (order.shippingMethodName === null) {
      return order.collectionPointName == null ? (
        <FormattedMessage {...orderPaymentMessages.shippingDoesNotApply} />
      ) : (
        <FormattedMessage {...orderPaymentMessages.clickAndCollectShippingMethod} />
      );
    }

    return order.shippingMethodName;
  };

  return (
    <DashboardCard data-test-id="OrderPayment">
      <DashboardCard.Header>
        <DashboardCard.Title>
          <FormattedMessage {...orderPaymentMessages.paymentTitle} />

          {order?.paymentStatus && (
            <Pill
              className={sprinkles({
                marginLeft: 2,
                marginRight: "auto",
              })}
              label={payment.localized}
              color={payment.status}
              data-test-id="payment-status"
            />
          )}
        </DashboardCard.Title>

        <DashboardCard.Toolbar>
          {!order?.paymentStatus ? (
            <Skeleton />
          ) : (
            <div className={classes.titleContainer}>
              {order?.status !== OrderStatus.CANCELED &&
                (canCapture || canRefund || canVoid || canMarkAsPaid) && (
                  <div className={classes.actions}>
                    {canCapture && (
                      <Button variant="tertiary" onClick={onCapture}>
                        <FormattedMessage {...paymentButtonMessages.capture} />
                      </Button>
                    )}
                    {canRefund && (
                      <Button variant="tertiary" onClick={onRefund} data-test-id="refund-button">
                        <FormattedMessage {...paymentButtonMessages.refund} />
                      </Button>
                    )}
                    {canVoid && (
                      <Button variant="tertiary" onClick={onVoid}>
                        <FormattedMessage {...paymentButtonMessages.void} />
                      </Button>
                    )}
                    {canMarkAsPaid && (
                      <Button
                        variant="tertiary"
                        onClick={onMarkAsPaid}
                        data-test-id="markAsPaidButton"
                      >
                        <FormattedMessage {...paymentButtonMessages.markAsPaid} />
                      </Button>
                    )}
                  </div>
                )}
            </div>
          )}
        </DashboardCard.Toolbar>
      </DashboardCard.Header>
      <DashboardCard.Content className={classes.payments}>
        <div className={classes.root}>
          {order?.discounts?.map(discount => (
            <div key={discount.id}>
              <FormattedMessage {...orderPaymentMessages.discount} />
              <HorizontalSpacer spacing={4} />
              <span className={classes.supportText}>{getDiscountTypeLabel(discount, intl)}</span>
              <span
                className={clsx(
                  classes.leftmostRightAlignedElement,
                  classes.smallFont,
                  classes.supportText,
                )}
              >
                <FormattedMessage {...orderPaymentMessages.includedInSubtotal} />
              </span>
              <HorizontalSpacer spacing={2} />
              <div className={classes.supportText}>
                <Money money={getDiscountAmount(discount.amount)} />
              </div>
            </div>
          ))}
          <div>
            <FormattedMessage {...orderPaymentMessages.subtotal} />
            <div className={classes.leftmostRightAlignedElement}>
              {<Money money={order?.subtotal.gross} /> ?? <Skeleton />}
            </div>
          </div>
          <div>
            <FormattedMessage {...orderPaymentMessages.shipping} />
            <HorizontalSpacer spacing={4} />
            <div className={classes.supportText}>{getDeliveryMethodName(order)}</div>
            <div className={classes.leftmostRightAlignedElement}>
              {<Money money={order?.shippingPrice.gross} /> ?? <Skeleton />}
            </div>
          </div>
          <div>
            <FormattedMessage {...orderPaymentMessages.taxes} />
            {order?.total.tax.amount > 0 && (
              <>
                <div
                  className={clsx(
                    classes.supportText,
                    classes.smallFont,
                    classes.leftmostRightAlignedElement,
                  )}
                >
                  <FormattedMessage {...orderPaymentMessages.includedInPrices} />{" "}
                </div>
                <HorizontalSpacer spacing={2} />
              </>
            )}
            <div
              className={clsx(
                {
                  [classes.leftmostRightAlignedElement]: order?.total.tax.amount === 0,
                },
                classes.supportText,
              )}
            >
              {<Money money={order?.total.tax} /> ?? <Skeleton />}
            </div>
          </div>
          <div className={classes.totalRow}>
            <FormattedMessage {...orderPaymentMessages.total} />
            <div className={classes.leftmostRightAlignedElement}>
              {<Money money={order?.total.gross} /> ?? <Skeleton />}
            </div>
          </div>
        </div>
      </DashboardCard.Content>
      <Divider />
      <DashboardCard.Content className={classes.payments}>
        <div className={classes.root}>
          {!!usedGiftCardAmount && usedGiftcards && (
            <div>
              <OrderUsedGiftCards giftCards={usedGiftcards} />
              <div className={classes.leftmostRightAlignedElement}>
                <Money
                  money={{
                    amount: usedGiftCardAmount,
                    currency: order?.total?.gross?.currency,
                  }}
                />
              </div>
            </div>
          )}
          <div>
            <FormattedMessage {...orderPaymentMessages.preauthorized} />
            <div className={classes.leftmostRightAlignedElement}>
              {<Money money={order?.totalAuthorized} /> ?? <Skeleton />}
            </div>
          </div>
          <div>
            <FormattedMessage {...orderPaymentMessages.captured} />
            <div className={classes.leftmostRightAlignedElement}>
              {<Money money={order?.totalCaptured} /> ?? <Skeleton />}
            </div>
          </div>
          {!!refundedAmount?.amount && (
            <div>
              <FormattedMessage {...orderPaymentMessages.refunded} />
              <div className={classes.leftmostRightAlignedElement}>
                {<Money money={refundedAmount} />}
              </div>
            </div>
          )}
          <div
            className={clsx(
              { [classes.success]: order?.totalBalance.amount === 0 },
              classes.totalRow,
            )}
          >
            <FormattedMessage {...orderPaymentMessages.outstanding} />
            <div
              className={classes.leftmostRightAlignedElement}
              data-test-id="order-balance-status"
            >
              {order?.totalBalance.amount === 0 ? (
                <FormattedMessage {...orderPaymentMessages.settled} />
              ) : (
                <Money money={order?.totalBalance} /> ?? <Skeleton />
              )}
              {}
            </div>
          </div>
        </div>
      </DashboardCard.Content>
    </DashboardCard>
  );
};

OrderPayment.displayName = "OrderPayment";
export default OrderPayment;
