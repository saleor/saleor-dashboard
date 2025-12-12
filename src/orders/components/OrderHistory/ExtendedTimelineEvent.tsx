// @ts-strict-ignore
import { CopyableText } from "@dashboard/components/CopyableText/CopyableText";
import Money from "@dashboard/components/Money";
import { TimelineEvent } from "@dashboard/components/Timeline/TimelineEvent";
import { TitleElement } from "@dashboard/components/Timeline/TimelineEventHeader";
import { toActor } from "@dashboard/components/Timeline/utils";
import { OrderEventFragment, OrderEventsEnum } from "@dashboard/graphql";
import { Box, Text } from "@saleor/macaw-ui-next";
import camelCase from "lodash/camelCase";
import { CheckIcon } from "lucide-react";
import { defineMessages, MessageDescriptor, useIntl } from "react-intl";

import ExtendedDiscountTimelineEvent from "./ExtendedDiscountTimelineEvent";
import {
  getOrderNumberLink,
  hasOrderLineDiscountWithNoPreviousValue,
  isTimelineEventOfDiscountType,
} from "./utils";

interface OrderLineItemProps {
  orderLine: OrderEventFragment["lines"][0]["orderLine"];
  quantity: number;
  itemName: string;
}

const OrderLineItem = ({ orderLine, quantity, itemName }: OrderLineItemProps) => (
  <Box display="flex" alignItems="center" justifyContent="space-between" gap={3}>
    <Box display="flex" flexDirection="column">
      <Text size={3} fontWeight="medium">
        {orderLine?.productName || itemName}
      </Text>
      {orderLine?.variantName && (
        <Text size={2} color="default2">
          {orderLine.variantName}
        </Text>
      )}
    </Box>
    <Text size={3} color="default2" whiteSpace="nowrap" flexShrink="0">
      ×{quantity}
    </Text>
  </Box>
);

interface LabelValueRowProps {
  label: string;
  children: React.ReactNode;
}

const LabelValueRow = ({ label, children }: LabelValueRowProps) => (
  <Box display="flex" justifyContent="space-between" alignItems="center">
    <Text size={2} color="default2">
      {label}
    </Text>
    {children}
  </Box>
);

const titles: Record<string, MessageDescriptor> = defineMessages({
  draftCreatedFromReplace: {
    id: "H6SfJd",
    defaultMessage: "Draft was reissued from order",
    description: "draft created from replace event title",
  },
  fulfillmentRefunded: {
    id: "werrDz",
    defaultMessage: "Products were refunded",
    description: "refunded event title",
  },
  fulfillmentReplaced: {
    id: "AWGJnU",
    defaultMessage: "Products were replaced",
    description: "replaced event title",
  },
  fulfillmentReturned: {
    id: "VtlDMr",
    defaultMessage: "Products were returned",
    description: "returned event title",
  },
  orderDiscountAdded: {
    id: "IUWJKt",
    defaultMessage: "Order was discounted",
    description: "order was discounted event title",
  },
  orderDiscountAutomaticallyUpdated: {
    id: "8V1ozm",
    defaultMessage: "Order discount was updated automatically",
    description: "order discount was updated automatically event title",
  },
  orderDiscountUpdated: {
    id: "JYfMRO",
    defaultMessage: "Order discount was updated",
    description: "order discount was updated event title",
  },
  orderLineDiscountAdded: {
    id: "vV9xwl",
    defaultMessage: "{productName} discount was added",
    description: "order line discount added title",
  },
  orderLineDiscountUpdated: {
    id: "bKCoN5",
    defaultMessage: "{productName} discount was updated",
    description: "order line discount updated title",
  },
  orderMarkedAsPaid: {
    id: "TQlnsR",
    defaultMessage: "Order was marked as paid",
    description: "order marked as paid event title",
  },
});

const messages = defineMessages({
  refundedAmount: {
    id: "nngeI3",
    defaultMessage: "Refunded amount",
    description: "amount title",
  },
  refundedShipment: {
    id: "Krzyo+",
    defaultMessage: "Shipment was refunded",
    description: "shipment refund title",
  },
  transactionReference: {
    id: "XWGZLL",
    defaultMessage: "Transaction reference",
    description: "transaction reference subtitle",
  },
});

interface ExtendedTimelineEventProps {
  event: OrderEventFragment;
  orderCurrency: string;
  hasPlainDate?: boolean;
  date: string | React.ReactNode;
  isLastInGroup?: boolean;
}

const ExtendedTimelineEvent = ({
  event,
  orderCurrency,
  hasPlainDate,
  date,
  isLastInGroup,
}: ExtendedTimelineEventProps) => {
  const { id, type, message, lines, amount, transactionReference, shippingCostsIncluded } = event;
  const intl = useIntl();
  const eventTypeInCamelCase = camelCase(type);
  const getEventTitleMessageInCamelCase = (): MessageDescriptor => {
    if (hasOrderLineDiscountWithNoPreviousValue(event)) {
      return titles.orderLineDiscountAdded;
    }

    return titles[eventTypeInCamelCase];
  };
  const getTitleProps = (): Record<string, string | undefined> => {
    if (type === OrderEventsEnum.ORDER_LINE_DISCOUNT_UPDATED) {
      return { productName: lines[0]?.itemName };
    }

    return {};
  };
  const titleElements = {
    orderNumber: getOrderNumberLink(event),
    title: {
      text: intl.formatMessage(getEventTitleMessageInCamelCase(), getTitleProps()),
    },
  };
  const selectTitleElements = (): TitleElement[] => {
    const { title, orderNumber } = titleElements;

    switch (type) {
      case OrderEventsEnum.DRAFT_CREATED_FROM_REPLACE: {
        return [title, orderNumber];
      }
      default: {
        return [title];
      }
    }
  };

  if (isTimelineEventOfDiscountType(type)) {
    return (
      <ExtendedDiscountTimelineEvent
        event={event}
        titleElements={selectTitleElements()}
        isLastInGroup={isLastInGroup}
      />
    );
  }

  const hasFooterContent =
    amount || amount === 0 || shippingCostsIncluded || !!transactionReference;

  return (
    <TimelineEvent
      date={date}
      titleElements={selectTitleElements()}
      key={id}
      hasPlainDate={hasPlainDate}
      eventData={event}
      actor={toActor(event.user, event.app)}
      eventType={type}
      isLastInGroup={isLastInGroup}
    >
      <Box display="flex" flexDirection="column" gap={1}>
        {/* Message content */}
        {message && (
          <Text size={2} style={{ whiteSpace: "pre-wrap" }}>
            {message}
          </Text>
        )}

        {/* Order lines */}
        {lines && lines.length > 0 && (
          <>
            {message && <Box paddingTop={1} />}
            {lines.map(({ orderLine, quantity, itemName }, i) => (
              <OrderLineItem
                key={orderLine?.id ? `${id}-line-${orderLine.id}` : `${id}-line-${i}`}
                orderLine={orderLine}
                quantity={quantity}
                itemName={itemName}
              />
            ))}
          </>
        )}

        {/* Footer with metadata */}
        {hasFooterContent && (
          <Box display="flex" flexDirection="column" gap={1} paddingTop={2}>
            {(amount || amount === 0) && (
              <LabelValueRow label={intl.formatMessage(messages.refundedAmount)}>
                <Text size={2}>
                  <Money money={{ amount, currency: orderCurrency }} />
                </Text>
              </LabelValueRow>
            )}
            {shippingCostsIncluded && (
              <LabelValueRow label={intl.formatMessage(messages.refundedShipment)}>
                <CheckIcon size={14} />
              </LabelValueRow>
            )}
            {!!transactionReference && (
              <LabelValueRow label={intl.formatMessage(messages.transactionReference)}>
                <CopyableText text={transactionReference} />
              </LabelValueRow>
            )}
          </Box>
        )}
      </Box>
    </TimelineEvent>
  );
};

export { ExtendedTimelineEvent };
