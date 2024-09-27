// @ts-strict-ignore
import CardSpacer from "@dashboard/components/CardSpacer";
import HorizontalSpacer from "@dashboard/components/HorizontalSpacer";
import { TimelineEvent } from "@dashboard/components/Timeline";
import { TitleElement } from "@dashboard/components/Timeline/TimelineEventHeader";
import { OrderEventFragment, OrderEventsEnum } from "@dashboard/graphql";
import { makeStyles } from "@saleor/macaw-ui";
import { Text } from "@saleor/macaw-ui-next";
import React from "react";
import { defineMessages, useIntl } from "react-intl";

import Label from "../Label";
import MoneySection, { MoneySectionType } from "./MoneySection";

const useStyles = makeStyles(
  () => ({
    horizontalContainer: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "baseline",
      width: "100%",
    },
  }),
  { name: "ExtendedDiscountTimelineEvent" },
);

const messages = defineMessages({
  reasonLabel: {
    id: "kVOslW",
    defaultMessage: "Reason for discount",
    description: "reason for discount label",
  },
});

interface ExtendedTimelineEventProps {
  event: OrderEventFragment;
  titleElements: TitleElement[];
}

const ExtendedDiscountTimelineEvent: React.FC<ExtendedTimelineEventProps> = ({
  event,
  titleElements,
}) => {
  const classes = useStyles({});
  const intl = useIntl();
  const { lines, date, type } = event;
  const parsedDiscount =
    type === OrderEventsEnum.ORDER_LINE_DISCOUNT_UPDATED ? lines[0].discount : event.discount;
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
    <TimelineEvent date={date} titleElements={titleElements}>
      {shouldDisplayOldNewSections && (
        <div className={classes.horizontalContainer}>
          <MoneySection
            sectionType={MoneySectionType.NEW}
            value={value}
            moneyData={moneyData}
            calculationMode={calculationMode}
          />
          <HorizontalSpacer spacing={4} />
          <MoneySection
            sectionType={MoneySectionType.OLD}
            value={oldValue}
            moneyData={oldMoneyData}
            calculationMode={oldCalculationMode}
          />
        </div>
      )}

      {!shouldDisplayOldNewSections && (
        <MoneySection
          sectionType={MoneySectionType.ONLY}
          value={value}
          moneyData={moneyData}
          calculationMode={calculationMode}
        />
      )}

      <CardSpacer />
      {!!reason && (
        <>
          <Label text={intl.formatMessage(messages.reasonLabel)} />
          <Text>{reason}</Text>
        </>
      )}
    </TimelineEvent>
  );
};

export default ExtendedDiscountTimelineEvent;
