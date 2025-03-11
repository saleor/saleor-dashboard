import { Box, Text } from "@saleor/macaw-ui-next";
import React, { ReactNode } from "react";
import { Link } from "react-router-dom";

import { DateTime } from "../Date";

export interface TitleElement {
  text: string;
  link?: string;
}

export interface TimelineEventHeaderProps {
  title?: React.ReactNode;
  date: string;
  titleElements?: TitleElement[];
  secondaryTitle?: string;
  hasPlainDate?: boolean;
  children?: ReactNode;
}

export const TimelineEventHeader: React.FC<TimelineEventHeaderProps> = props => {
  const { title, date, titleElements, secondaryTitle, hasPlainDate, children } = props;

  const elements = titleElements?.filter(Boolean) ?? [];

  return (
    <Box
      display="flex"
      alignItems="center"
      flexDirection="row"
      justifyContent="space-between"
      width="100%"
    >
      {title && (
        <Text size={3} wordBreak="break-all">
          {title}
        </Text>
      )}
      {elements.length > 0 && (
        <Box display="flex" alignItems="center" flexDirection="row" flexWrap="wrap">
          {elements.map(({ text, link }) => {
            if (link) {
              return (
                <Link to={link} key={`timeline-event-${link}`}>
                  <Text marginRight={0.5} size={3} color="accent1">
                    {text}
                  </Text>
                </Link>
              );
            }

            return (
              <Text size={3} marginRight={0.5} key={`timeline-event-${text}`}>
                {text}
              </Text>
            );
          })}
        </Box>
      )}
      <Box display="flex" alignItems="center" gap={5} marginLeft="auto">
        {children}
        <Text size={3} color="default2" whiteSpace="nowrap">
          <DateTime date={date} plain={hasPlainDate} />
        </Text>
      </Box>
      {secondaryTitle && <Text marginTop={2}>{secondaryTitle}</Text>}
    </Box>
  );
};

export default TimelineEventHeader;
