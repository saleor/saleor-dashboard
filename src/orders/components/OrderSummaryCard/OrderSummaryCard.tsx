// @ts-strict-ignore
import CardTitle from "@dashboard/components/CardTitle";
import { OrderDetailsFragment } from "@dashboard/graphql";
import { getDiscountTypeLabel } from "@dashboard/orders/utils/data";
import { Card, CardContent } from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { obtainUsedGifrcards } from "../OrderPayment/utils";
import { OrderUsedGiftCards } from "../OrderUsedGiftCards";
import { orderSummaryMessages } from "./messages";
import SummaryLine from "./SummaryLine";
import { SummaryList } from "./SummaryList";
import {
  extractOrderGiftCardUsedAmount,
  getDeliveryMethodName,
  getTaxTypeText,
} from "./utils";

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
  const usedGiftcards = obtainUsedGifrcards(order);

  return (
    <Card data-test-id="OrderSummaryCard">
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
            subText={getDeliveryMethodName(order, intl)}
            money={order?.shippingPrice?.gross}
          />
          <SummaryLine
            text={<FormattedMessage {...orderSummaryMessages.taxes} />}
            subText={getTaxTypeText(order, intl)}
            money={order?.total?.tax}
          />
          {order?.discounts?.map(discount => (
            <SummaryLine
              key={discount.id}
              text={<FormattedMessage {...orderSummaryMessages.discount} />}
              subText={getDiscountTypeLabel(discount, intl)}
              money={discount.amount}
            />
          ))}
          {/* TODO: Remove when gift cards are not treated as discounts */}
          {giftCardAmount > 0 && (
            <SummaryLine
              text={<OrderUsedGiftCards giftCards={usedGiftcards} />}
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
