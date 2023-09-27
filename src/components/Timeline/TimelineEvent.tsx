import { Accordion, Box, sprinkles, Text } from "@saleor/macaw-ui/next";
import React from "react";

import TimelineEventHeader, { TitleElement } from "./TimelineEventHeader";

export interface TimelineEventProps {
  children?: React.ReactNode;
  date: string;
  secondaryTitle?: string;
  title?: React.ReactNode;
  titleElements?: TitleElement[];
  hasPlainDate?: boolean;
}

export const TimelineEvent: React.FC<TimelineEventProps> = props => {
  const { children, date, secondaryTitle, title, titleElements, hasPlainDate } =
    props;

  const hasChildren =
    children && React.Children.toArray(children).filter(Boolean).length > 0;

  return (
    <Box
      display="flex"
      alignItems="center"
      marginBottom={5}
      position="relative"
      width="100%"
    >
      <Box
        as="span"
        position="absolute"
        backgroundColor="interactiveNeutralPressing"
        borderRadius="100%"
        __height="7px"
        __width="7px"
        __left="-28px"
        __top={hasChildren ? "13px" : "5px"}
      />
      {hasChildren ? (
        <Accordion
          className={sprinkles({
            width: "100%",
          })}
        >
          <Accordion.Item value="accordionItemId">
            <Accordion.Trigger>
              <TimelineEventHeader
                title={title}
                date={date}
                titleElements={titleElements}
                hasPlainDate={hasPlainDate}
              >
                <Accordion.TriggerButton dataTestId="expand-icon" />
              </TimelineEventHeader>
            </Accordion.Trigger>
            <Accordion.Content>
              <Text>{children}</Text>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion>
      ) : (
        <TimelineEventHeader
          title={title}
          titleElements={titleElements}
          secondaryTitle={secondaryTitle}
          date={date}
          hasPlainDate={hasPlainDate}
        />
      )}
    </Box>
  );
};
TimelineEvent.displayName = "TimelineEvent";
export default TimelineEvent;
