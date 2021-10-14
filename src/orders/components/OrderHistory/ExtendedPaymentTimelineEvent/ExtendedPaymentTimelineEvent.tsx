import { Typography } from "@material-ui/core";
import Money from "@saleor/components/Money";
import { TimelineEvent } from "@saleor/components/Timeline";
import { TitleElement } from "@saleor/components/Timeline/TimelineEventHeader";
import { OrderDetails_order_events } from "@saleor/orders/types/OrderDetails";
import { OrderEventsEnum } from "@saleor/types/globalTypes";
import React from "react";
import { defineMessages, useIntl } from "react-intl";

import Label from "../Label";
import { isPaymentFailEvent } from "../utils";

export const messages = defineMessages({
  refundedAmount: {
    defaultMessage: "Refunded amount",
    description: "refund amount title",
    id: "refund amount title"
  },
  capturedAmount: {
    defaultMessage: "Captured amount",
    description: "capture amount title",
    id: "capture amount title"
  },
  voidedAmount: {
    defaultMessage: "Voided amount",
    description: "void amount title",
    id: "void amount title"
  },
  authorizedAmount: {
    defaultMessage: "Authorized amount",
    description: "authorize amount title",
    id: "authorize amount title"
  },
  pspReference: {
    defaultMessage: "PSP Reference",
    description: "psp reference title",
    id: "psp reference title"
  },
  failReason: {
    defaultMessage: "Fail reason",
    description: "fail reason title",
    id: "fail reason title"
  }
});

interface ExtendedTimelineEventProps {
  event: OrderDetails_order_events;
  titleElements: TitleElement[];
  orderCurrency: string;
}

const isEmptyPsp = (pspReference: null | string) =>
  pspReference === undefined || pspReference == null || pspReference.length <= 0
    ? true
    : false;

const ExtendedPaymentTimelineEvent: React.FC<ExtendedTimelineEventProps> = ({
  event,
  titleElements,
  orderCurrency
}) => {
  const { id, date, type, pspReference, amount, message } = event;
  const intl = useIntl();

  const getAmountLabelMessage = () => {
    let labelMessage = "";

    if (type === OrderEventsEnum.PAYMENT_AUTHORIZED) {
      labelMessage = intl.formatMessage(messages.authorizedAmount);
    }

    if (
      type === OrderEventsEnum.PAYMENT_CAPTURED ||
      type === OrderEventsEnum.PAYMENT_CAPTURE_FAILED
    ) {
      labelMessage = intl.formatMessage(messages.capturedAmount);
    }

    if (
      type === OrderEventsEnum.PAYMENT_REFUNDED ||
      type === OrderEventsEnum.PAYMENT_REFUND_FAILED
    ) {
      labelMessage = intl.formatMessage(messages.refundedAmount);
    }

    if (
      type === OrderEventsEnum.PAYMENT_VOIDED ||
      type === OrderEventsEnum.PAYMENT_VOID_FAILED
    ) {
      labelMessage = intl.formatMessage(messages.voidedAmount);
    }

    return labelMessage;
  };

  return (
    <TimelineEvent key={id} date={date} titleElements={titleElements}>
      {!isEmptyPsp(pspReference) && (
        <>
          <Label text={intl.formatMessage(messages.pspReference)} />
          <Typography>{pspReference}</Typography>
        </>
      )}
      {isPaymentFailEvent(type) && (
        <>
          <Label text={intl.formatMessage(messages.failReason)} />
          <Typography>{message}</Typography>
        </>
      )}
      {!!amount && (
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
