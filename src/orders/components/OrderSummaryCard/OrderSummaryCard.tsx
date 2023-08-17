// @ts-strict-ignore
import CardTitle from "@dashboard/components/CardTitle";
import Link from "@dashboard/components/Link";
import { giftCardPath } from "@dashboard/giftCards/urls";
import { OrderDetailsFragment, OrderDiscountType } from "@dashboard/graphql";
import { Card, CardContent } from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { obtainUsedGifrcard } from "../OrderPayment/utils";
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
  const usedGiftcard = obtainUsedGifrcard(order);

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
                <FormattedMessage
                  {...orderSummaryMessages.paidWithGiftCard}
                  values={{
                    link: (
                      <Link href={giftCardPath(usedGiftcard.id)}>
                        {" "}
                        {usedGiftcard.last4CodeChars}
                      </Link>
                    ),
                  }}
                />
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
