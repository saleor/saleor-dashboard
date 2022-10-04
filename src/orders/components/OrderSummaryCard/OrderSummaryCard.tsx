import { Card, CardContent } from "@material-ui/core";
import CardTitle from "@saleor/components/CardTitle";
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

  const giftCardAmount = extractOrderGiftCardUsedAmount(order);

  const getDeliveryMethodName = (order: OrderDetailsFragment) => {
    if (
      order?.shippingMethodName === undefined &&
      order?.shippingPrice === undefined &&
      order?.collectionPointName === undefined
    ) {
      return null;
    }

    if (order.shippingMethodName === null) {
      return order.collectionPointName == null
        ? intl.formatMessage(orderSummaryMessages.shippingDoesNotApply)
        : intl.formatMessage(
            orderSummaryMessages.clickAndCollectShippingMethod,
          );
    }

    return order.shippingMethodName;
  };

  const getTaxTypeText = () => {
    if (order?.total?.tax === undefined) {
      return "";
    }
    if (order.total.tax.amount > 0) {
      return intl.formatMessage(orderSummaryMessages.vatIncluded);
    }
    return intl.formatMessage(orderSummaryMessages.vatNotIncluded);
  };

  return (
    <Card>
      <CardTitle
        title={<FormattedMessage {...orderSummaryMessages.orderSummary} />}
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
            subText={getTaxTypeText()}
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
          {/* TODO: Remove when gift cards are not treated as discounts */}
          {giftCardAmount > 0 && (
            <SummaryLine
              text={
                <FormattedMessage {...orderSummaryMessages.paidWithGiftCard} />
              }
              negative
              money={{
                amount: giftCardAmount,
                currency: order?.total?.gross?.currency,
              }}
            />
          )}
          <SummaryLine
            bold
            text={<FormattedMessage {...orderSummaryMessages.total} />}
            money={order?.total?.gross}
          />
        </SummaryList>
      </CardContent>
    </Card>
  );
};

OrderSummaryCard.displayName = "OrderPayment";
export default OrderSummaryCard;
