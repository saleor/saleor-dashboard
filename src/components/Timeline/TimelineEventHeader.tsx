import useNavigator from "@dashboard/hooks/useNavigator";
import { Box, sprinkles, Text } from "@saleor/macaw-ui/next";
import React, { ReactNode } from "react";

import { DateTime } from "../Date";
import Link from "../Link";

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

export const TimelineEventHeader: React.FC<
  TimelineEventHeaderProps
> = props => {
  const { title, date, titleElements, secondaryTitle, hasPlainDate, children } =
    props;
  const navigate = useNavigator();

  return (
    <Box
      display="flex"
      alignItems="center"
      flexDirection="row"
      justifyContent="space-between"
      width="100%"
    >
      {title && (
        <Text variant="caption" size="large" wordBreak="break-all">
          {title}
        </Text>
      )}
      {titleElements && (
        <Box
          display="flex"
          alignItems="center"
          flexDirection="row"
          flexWrap="wrap"
        >
          {titleElements.filter(Boolean).map(({ text, link }) => {
            if (link) {
              return (
                <Link
                  className={sprinkles({
                    marginRight: 0.5,
                  })}
                  onClick={() => navigate(link)}
                  key={`timeline-event-${link}`}
                >
                  {text}
                </Link>
              );
            }

            return (
              <Text
                variant="caption"
                size="large"
                marginRight={0.5}
                key={`timeline-event-${text}`}
              >
                {text}
              </Text>
            );
          })}
        </Box>
      )}
      <Box display="flex" alignItems="center" gap={5} marginLeft="auto">
        {children}
        <Text
          variant="caption"
          size="large"
          color="textNeutralSubdued"
          whiteSpace="nowrap"
        >
          <DateTime date={date} plain={hasPlainDate} />
        </Text>
      </Box>
      {secondaryTitle && <Text marginTop={2}>{secondaryTitle}</Text>}
    </Box>
  );
};

export default TimelineEventHeader;
