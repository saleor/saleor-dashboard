// @ts-strict-ignore
import { CopyableText } from "@dashboard/components/CopyableText/CopyableText";
import Money from "@dashboard/components/Money";
import { TimelineEvent } from "@dashboard/components/Timeline/TimelineEvent";
import { type TitleElement } from "@dashboard/components/Timeline/TimelineEventHeader";
import { toActor } from "@dashboard/components/Timeline/utils";
import { type OrderEventFragment, OrderEventsEnum } from "@dashboard/graphql";
import { Box, Text } from "@saleor/macaw-ui-next";
import { CheckIcon } from "lucide-react";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";

import { ExtendedDiscountTimelineEvent } from "./ExtendedDiscountTimelineEvent/ExtendedDiscountTimelineEvent";
import { OrderLineItem } from "./OrderLineItem";
import {
  getOrderNumberLink,
  hasOrderLineDiscountWithNoPreviousValue,
  isTimelineEventOfDiscountType,
} from "./utils";

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

const titles = defineMessages({
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
});

const eventTypeToTitleKey: Partial<Record<OrderEventsEnum, keyof typeof titles>> = {
  [OrderEventsEnum.DRAFT_CREATED_FROM_REPLACE]: "draftCreatedFromReplace",
  [OrderEventsEnum.FULFILLMENT_REFUNDED]: "fulfillmentRefunded",
  [OrderEventsEnum.FULFILLMENT_REPLACED]: "fulfillmentReplaced",
  [OrderEventsEnum.FULFILLMENT_RETURNED]: "fulfillmentReturned",
  [OrderEventsEnum.ORDER_DISCOUNT_ADDED]: "orderDiscountAdded",
  [OrderEventsEnum.ORDER_DISCOUNT_AUTOMATICALLY_UPDATED]: "orderDiscountAutomaticallyUpdated",
  [OrderEventsEnum.ORDER_DISCOUNT_UPDATED]: "orderDiscountUpdated",
  [OrderEventsEnum.ORDER_LINE_DISCOUNT_UPDATED]: "orderLineDiscountUpdated",
};

// Some timeline events intentionally do not map to a dedicated title in this component.
const FALLBACK_TITLE_TEXT = "";

const localMessages = defineMessages({
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

  if (isTimelineEventOfDiscountType(type)) {
    if (type === OrderEventsEnum.ORDER_LINE_DISCOUNT_UPDATED) {
      const productName = lines?.[0]?.itemName;
      const isAdded = hasOrderLineDiscountWithNoPreviousValue(event);
      const messageDescriptor = isAdded
        ? titles.orderLineDiscountAdded
        : titles.orderLineDiscountUpdated;

      return (
        <ExtendedDiscountTimelineEvent
          event={event}
          title={
            <FormattedMessage
              {...messageDescriptor}
              values={{
                productName: (
                  <Text size={3} fontWeight="medium" as="span">
                    {productName}
                  </Text>
                ),
              }}
            />
          }
          isLastInGroup={isLastInGroup}
        />
      );
    }

    const titleKey = eventTypeToTitleKey[type];
    const titleMessage = titleKey ? titles[titleKey] : undefined;

    return (
      <ExtendedDiscountTimelineEvent
        event={event}
        titleElements={titleMessage ? [{ text: intl.formatMessage(titleMessage) }] : undefined}
        isLastInGroup={isLastInGroup}
      />
    );
  }

  const titleKey = eventTypeToTitleKey[type];
  const titleMessage = titleKey ? titles[titleKey] : undefined;
  const titleText = titleMessage ? intl.formatMessage(titleMessage) : FALLBACK_TITLE_TEXT;
  const titleElement: TitleElement = { text: titleText };

  const selectTitleElements = (): TitleElement[] => {
    if (type === OrderEventsEnum.DRAFT_CREATED_FROM_REPLACE) {
      const orderNumberLink = getOrderNumberLink(event);

      return orderNumberLink ? [titleElement, orderNumberLink] : [titleElement];
    }

    return [titleElement];
  };

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
        {message && (
          <Text size={2} style={{ whiteSpace: "pre-wrap" }}>
            {message}
          </Text>
        )}

        {lines && lines.length > 0 && (
          <>
            {message && <Box paddingTop={1} />}
            {lines.map(({ orderLine, quantity, itemName }, i) => (
              <OrderLineItem
                key={orderLine?.id ? `${id}-line-${orderLine.id}` : `${id}-line-${i}`}
                orderLine={orderLine}
                quantity={quantity ?? 0}
                fallbackItemName={itemName ?? "Product"}
              />
            ))}
          </>
        )}

        {hasFooterContent && (
          <Box display="flex" flexDirection="column" gap={1} paddingTop={2}>
            {(amount || amount === 0) && (
              <LabelValueRow label={intl.formatMessage(localMessages.refundedAmount)}>
                <Text size={2}>
                  <Money money={{ amount, currency: orderCurrency }} />
                </Text>
              </LabelValueRow>
            )}
            {shippingCostsIncluded && (
              <LabelValueRow label={intl.formatMessage(localMessages.refundedShipment)}>
                <CheckIcon size={14} />
              </LabelValueRow>
            )}
            {!!transactionReference && (
              <LabelValueRow label={intl.formatMessage(localMessages.transactionReference)}>
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
