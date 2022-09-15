import { Card, CardContent } from "@material-ui/core";
import CardTitle from "@saleor/components/CardTitle";
import { Hr } from "@saleor/components/Hr";
import Skeleton from "@saleor/components/Skeleton";
import { OrderDetailsFragment, OrderDiscountType } from "@saleor/graphql";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { orderSummaryMessages } from "./messages";
import SummaryLine from "./SummaryLine";
import { SummaryList } from "./SummaryList";
import { extractOrderGiftCardUsedAmount } from "./utils";

interface OrderPaymentProps {
  order: OrderDetailsFragment;
}

const useStyles = makeStyles(
  theme => ({
    list: {
      "& li:nth-last-child(2)": {
        paddingBottom: theme.spacing(1),
      },
      "& li:last-of-type": {
        borderTop: `1px solid ${theme.palette.saleor.main[5]}`,
        paddingTop: theme.spacing(1),
        marginTop: "auto",
      },
    },
  }),
  { name: "OrderSummaryCard" },
);

const OrderSummaryCard: React.FC<OrderPaymentProps> = ({ order }) => {
  const classes = useStyles();

  const intl = useIntl();

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
            <FormattedMessage {...orderSummaryMessages.orderSummary} />
          )
        }
      />
      <CardContent>
        <SummaryList className={classes.list}>
          <SummaryLine
            text={<FormattedMessage {...orderSummaryMessages.subtotal} />}
            money={order?.subtotal?.gross}
          />
          <SummaryLine
            text={<FormattedMessage {...orderSummaryMessages.shipping} />}
            subText={getDeliveryMethodName(order)}
            money={order?.shippingPrice?.gross}
          />
          <SummaryLine
            text={<FormattedMessage {...orderSummaryMessages.taxes} />}
            subText={
              order?.total?.tax === undefined
                ? ""
                : order.total.tax.amount > 0
                ? intl.formatMessage(orderSummaryMessages.vatIncluded)
                : intl.formatMessage(orderSummaryMessages.vatNotIncluded)
            }
            money={order?.total?.tax}
          />
          {order?.discounts?.map(discount => (
            <SummaryLine
              text={<FormattedMessage {...orderSummaryMessages.discount} />}
              subText={
                discount.type === OrderDiscountType.MANUAL
                  ? intl.formatMessage(orderSummaryMessages.staffAdded)
                  : intl.formatMessage(orderSummaryMessages.voucher)
              }
              money={discount.amount}
            />
          ))}
          <SummaryLine
            bold
            text={<FormattedMessage {...orderSummaryMessages.total} />}
            money={order?.total?.gross}
          />
        </SummaryList>
      </CardContent>
      {!!usedGiftCardAmount && (
        <>
          <Hr />
          <CardContent>
            <SummaryList>
              <SummaryLine
                text={
                  <FormattedMessage
                    {...orderSummaryMessages.paidWithGiftCard}
                  />
                }
                money={{
                  amount: usedGiftCardAmount,
                  currency: order?.total?.gross?.currency,
                }}
              />
            </SummaryList>
          </CardContent>
        </>
      )}
    </Card>
  );
};

OrderSummaryCard.displayName = "OrderPayment";
export default OrderSummaryCard;
