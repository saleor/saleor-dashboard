import { TimelineEvent } from "@dashboard/components/Timeline/TimelineEvent";
import { type TitleElement } from "@dashboard/components/Timeline/TimelineEventHeader";
import { toActor } from "@dashboard/components/Timeline/utils";
import { type OrderEventFragment, OrderEventsEnum } from "@dashboard/graphql";
import { Box, Text } from "@saleor/macaw-ui-next";
import { type ReactNode } from "react";
import { defineMessages, useIntl } from "react-intl";

import { OrderHistoryDate } from "../OrderHistoryDate";
import { MoneySection, MoneySectionType } from "./MoneySection";

const messages = defineMessages({
  reasonLabel: {
    id: "kVOslW",
    defaultMessage: "Reason for discount",
    description: "reason for discount label",
  },
});

interface ExtendedDiscountTimelineEventProps {
  event: OrderEventFragment;
  title?: ReactNode;
  titleElements?: TitleElement[];
  isLastInGroup?: boolean;
}

export const ExtendedDiscountTimelineEvent = ({
  event,
  title,
  titleElements,
  isLastInGroup,
}: ExtendedDiscountTimelineEventProps) => {
  const intl = useIntl();
  const { lines, date, type } = event;
  const parsedDiscount =
    type === OrderEventsEnum.ORDER_LINE_DISCOUNT_UPDATED ? lines?.[0]?.discount : event.discount;

  if (!parsedDiscount) {
    return null;
  }

  const {
    valueType: calculationMode,
    value,
    reason,
    amount: moneyData,
    oldValueType: oldCalculationMode,
    oldValue,
    oldAmount: oldMoneyData,
  } = parsedDiscount;
  const shouldDisplayOldNewSections = !!oldValue;

  return (
    <TimelineEvent
      date={<OrderHistoryDate date={date} />}
      title={title}
      titleElements={titleElements}
      eventData={event}
      actor={toActor(event.user, event.app)}
      eventType={type}
      isLastInGroup={isLastInGroup}
    >
      <Box display="flex" flexDirection="column" gap={3}>
        {shouldDisplayOldNewSections ? (
          <Box display="flex" alignItems="center" gap={4}>
            <MoneySection
              sectionType={MoneySectionType.OLD}
              value={oldValue}
              moneyData={oldMoneyData}
              calculationMode={oldCalculationMode}
            />
            <Text size={3} color="default2">
              →
            </Text>
            <MoneySection
              sectionType={MoneySectionType.NEW}
              value={value}
              moneyData={moneyData}
              calculationMode={calculationMode}
            />
          </Box>
        ) : (
          <MoneySection
            sectionType={MoneySectionType.ONLY}
            value={value}
            moneyData={moneyData}
            calculationMode={calculationMode}
          />
        )}

        {!!reason && (
          <Box display="flex" flexDirection="column" gap={1}>
            <Text size={2} color="default2">
              {intl.formatMessage(messages.reasonLabel)}
            </Text>
            <Text size={3}>{reason}</Text>
          </Box>
        )}
      </Box>
    </TimelineEvent>
  );
};
