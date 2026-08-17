import { Box, Text } from "@saleor/macaw-ui-next";
import { type ReactNode } from "react";

import { DateTime } from "../Date/DateTime";
import { type TimelineEntity, TimelineLink } from "./TimelineLink";
import { type Actor } from "./types";
import { getActorDisplayName, getActorLink } from "./utils";

export interface TitleElement {
  text: string;
  link?: string;
  /** Saleor entity icon when `link` is set. */
  entity?: TimelineEntity;
}

interface TimelineEventHeaderProps {
  title?: React.ReactNode;
  date: string | React.ReactNode;
  titleElements?: TitleElement[];
  hasPlainDate?: boolean;
  children?: ReactNode;
  tooltip?: ReactNode;
  actor?: Actor;
}

const actorEntity = (actor: Actor | undefined): TimelineEntity | undefined => {
  if (!actor) {
    return undefined;
  }

  return actor.type === "app" ? "app" : "staff";
};

export const TimelineEventHeader = ({
  title,
  date,
  titleElements,
  hasPlainDate,
  children,
  tooltip,
  actor,
}: TimelineEventHeaderProps) => {
  const elements = titleElements?.filter(Boolean) ?? [];

  const actorName = getActorDisplayName(actor);
  const actorLink = getActorLink(actor);

  const dateToRender =
    typeof date === "string" ? <DateTime date={date} plain={hasPlainDate} /> : date;

  const attribution = actorName ? (
    <Text size={3} color="default2" as="span" marginLeft={1}>
      by{" "}
      {actorLink ? (
        <TimelineLink href={actorLink} entity={actorEntity(actor)} color="default2">
          {actorName}
        </TimelineLink>
      ) : (
        <Text size={3} color="default2" as="span">
          {actorName}
        </Text>
      )}
    </Text>
  ) : null;

  return (
    <Box display="flex" flexDirection="column" width="100%">
      <Box
        display="flex"
        alignItems="center"
        flexDirection="row"
        justifyContent="space-between"
        width="100%"
      >
        <Box display="flex" alignItems="center" flexWrap="wrap">
          {title && (
            <Text size={3} color="default1" wordBreak="break-all">
              {title}
            </Text>
          )}
          {elements.length > 0 && (
            <Box display="flex" alignItems="center" flexDirection="row" flexWrap="wrap">
              {elements.map(({ text, link, entity }, index) => {
                if (link) {
                  return (
                    <Box as="span" marginRight={0.5} key={`timeline-event-${link}-${index}`}>
                      <TimelineLink href={link} entity={entity}>
                        {text}
                      </TimelineLink>
                    </Box>
                  );
                }

                return (
                  <Text
                    size={3}
                    color="default1"
                    marginRight={0.5}
                    key={`timeline-event-${text}-${index}`}
                  >
                    {text}
                  </Text>
                );
              })}
            </Box>
          )}
          {attribution}
        </Box>
        <Box display="flex" alignItems="center" gap={2} marginLeft="auto" flexShrink="0">
          {tooltip}
          <Text size={2} color="default2" whiteSpace="nowrap">
            {dateToRender}
          </Text>
          {children}
        </Box>
      </Box>
    </Box>
  );
};
