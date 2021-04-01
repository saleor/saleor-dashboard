import { Typography } from "@material-ui/core";
import HorizontalSpacer from "@saleor/apps/components/HorizontalSpacer";
import CardSpacer from "@saleor/components/CardSpacer";
import { TimelineEvent } from "@saleor/components/Timeline";
import { TitleElement } from "@saleor/components/Timeline/TimelineEventHeader";
import { OrderDetails_order_events } from "@saleor/orders/types/OrderDetails";
import { makeStyles } from "@saleor/theme";
import { OrderEventsEnum } from "@saleor/types/globalTypes";
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
      width: "100%"
    }
  }),
  { name: "ExtendedDiscountTimelineEvent" }
);

export const messages = defineMessages({
  reasonLabel: {
    defaultMessage: "Reason for discount",
    description: "reason for discount label"
  }
});

interface ExtendedTimelineEventProps {
  event: OrderDetails_order_events;
  titleElements: TitleElement[];
}

const ExtendedDiscountTimelineEvent: React.FC<ExtendedTimelineEventProps> = ({
  event,
  titleElements
}) => {
  const classes = useStyles({});
  const intl = useIntl();

  const { lines, date, type } = event;

  const parsedDiscount =
    type === OrderEventsEnum.ORDER_LINE_DISCOUNT_UPDATED
      ? lines[0].discount
      : event.discount;

  const {
    valueType: calculationMode,
    value,
    reason,
    amount: moneyData,
    oldValueType: oldCalculationMode,
    oldValue,
    oldAmount: oldMoneyData
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
          <Typography>{reason}</Typography>
        </>
      )}
    </TimelineEvent>
  );
};

export default ExtendedDiscountTimelineEvent;
