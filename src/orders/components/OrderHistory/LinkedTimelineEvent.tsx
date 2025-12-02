// @ts-strict-ignore
import { TimelineEvent } from "@dashboard/components/Timeline";
import { TitleElement } from "@dashboard/components/Timeline/TimelineEventHeader";
import { OrderEventFragment, OrderEventsEnum } from "@dashboard/graphql";
import { orderUrl } from "@dashboard/orders/urls";
import { defineMessages, useIntl } from "react-intl";

const replacementCreatedMessages = defineMessages({
  description: {
    id: "kvSYZh",
    defaultMessage: "was created for replaced products",
    description: "replacement created order history message description",
  },
  draftNumber: {
    id: "NrsKic",
    defaultMessage: "Draft #{orderNumber}",
    description: "replacement created order history message draft number",
  },
});

const discountRemovedMessages = defineMessages({
  orderDiscountRemoved: {
    id: "EzcZkZ",
    defaultMessage: "Order discount was removed",
    description: "order discount removed title",
  },
  productDiscountRemoved: {
    id: "J4pxY1",
    defaultMessage: "{productName} discount was removed",
    description: "product discount removed title",
  },
});

interface LinkedTimelineEventProps {
  event: OrderEventFragment;
  hasPlainDate?: boolean;
  dateNode?: React.ReactNode;
  isLastInGroup?: boolean;
}

const LinkedTimelineEvent = ({
  event,
  hasPlainDate,
  dateNode,
  isLastInGroup,
}: LinkedTimelineEventProps) => {
  const intl = useIntl();
  const getTitleElements = (): TitleElement[] => {
    const { type, relatedOrder, lines } = event;

    switch (type) {
      case OrderEventsEnum.ORDER_REPLACEMENT_CREATED: {
        return [
          {
            link: orderUrl(relatedOrder?.id),
            text: intl.formatMessage(replacementCreatedMessages.draftNumber, {
              orderNumber: relatedOrder?.number,
            }),
          },
          { text: intl.formatMessage(replacementCreatedMessages.description) },
        ];
      }
      case OrderEventsEnum.ORDER_DISCOUNT_DELETED: {
        return [
          {
            text: intl.formatMessage(discountRemovedMessages.orderDiscountRemoved),
          },
        ];
      }
      case OrderEventsEnum.ORDER_LINE_DISCOUNT_REMOVED: {
        return [
          {
            text: intl.formatMessage(discountRemovedMessages.productDiscountRemoved, {
              productName: lines[0].itemName,
            }),
          },
        ];
      }
    }
  };

  return (
    <TimelineEvent
      titleElements={getTitleElements()}
      date={event.date}
      hasPlainDate={hasPlainDate}
      dateNode={dateNode}
      eventData={event}
      user={event.user}
      app={event.app}
      eventType={event.type}
      isLastInGroup={isLastInGroup}
    />
  );
};

export default LinkedTimelineEvent;
