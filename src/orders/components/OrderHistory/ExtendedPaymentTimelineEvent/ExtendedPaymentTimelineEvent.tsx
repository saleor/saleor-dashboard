import { Typography } from "@material-ui/core";
import Money from "@saleor/components/Money";
import { TimelineEvent } from "@saleor/components/Timeline";
import { TitleElement } from "@saleor/components/Timeline/TimelineEventHeader";
import { OrderDetails_order_events } from "@saleor/orders/types/OrderDetails";
import { OrderEventsEnum } from "@saleor/types/globalTypes";
import React from "react";
import { useIntl } from "react-intl";

import Label from "../Label";
import { isTimelineEventOfType } from "../utils";
import { extendedPaymentTimelineEventMessages as messages } from "./extendedPaymentTimelineEventMessages";

interface ExtendedTimelineEventProps {
  event: OrderDetails_order_events;
  titleElements: TitleElement[];
  orderCurrency: string;
}

const ExtendedPaymentTimelineEvent: React.FC<ExtendedTimelineEventProps> = ({
  event,
  titleElements,
  orderCurrency
}) => {
  const { date, type, pspReference, amount, message } = event;
  const intl = useIntl();

  const getAmountLabelMessage = () => {
    switch (type) {
      case OrderEventsEnum.PAYMENT_AUTHORIZED:
        return intl.formatMessage(messages.authorizedAmount);
      case OrderEventsEnum.PAYMENT_CAPTURED:
      case OrderEventsEnum.PAYMENT_CAPTURE_FAILED:
        return intl.formatMessage(messages.capturedAmount);
      case OrderEventsEnum.PAYMENT_REFUNDED:
      case OrderEventsEnum.PAYMENT_REFUND_FAILED:
        return intl.formatMessage(messages.refundedAmount);
      case OrderEventsEnum.PAYMENT_VOIDED:
      case OrderEventsEnum.PAYMENT_VOID_FAILED:
        return intl.formatMessage(messages.voidedAmount);
      default:
        return "";
    }
  };

  return (
    <TimelineEvent date={date} titleElements={titleElements}>
      {pspReference && (
        <>
          <Label text={intl.formatMessage(messages.pspReference)} />
          <Typography>{pspReference}</Typography>
        </>
      )}
      {isTimelineEventOfType("paymentFail", type) && (
        <>
          <Label text={intl.formatMessage(messages.failReason)} />
          <Typography>{message}</Typography>
        </>
      )}
      {amount !== null && (
        <>
          <Label text={getAmountLabelMessage()} />
          <Money
            money={{
              amount,
              currency: orderCurrency
            }}
          />
        </>
      )}
    </TimelineEvent>
  );
};

export default ExtendedPaymentTimelineEvent;
