import { ExtensionsPaths } from "@dashboard/extensions/urls";
import { getUserName } from "@dashboard/misc";
import { staffMemberDetailsUrl } from "@dashboard/staff/urls";
import { Box, Text } from "@saleor/macaw-ui-next";
import { ReactNode } from "react";
import * as React from "react";
import { Link } from "react-router-dom";

import { DateTime } from "../Date";
import styles from "./Timeline.module.css";

export interface TitleElement {
  text: string;
  link?: string;
}

export interface TimelineUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
}

export interface TimelineApp {
  id: string;
  name?: string | null;
}

interface TimelineEventHeaderProps {
  title?: React.ReactNode;
  date: string;
  titleElements?: TitleElement[];
  hasPlainDate?: boolean;
  children?: ReactNode;
  dateNode?: ReactNode;
  tooltip?: ReactNode;
  user?: TimelineUser | null;
  app?: TimelineApp | null;
}

export const TimelineEventHeader = ({
  title,
  date,
  titleElements,
  hasPlainDate,
  children,
  dateNode,
  tooltip,
  user,
  app,
}: TimelineEventHeaderProps) => {
  const elements = titleElements?.filter(Boolean) ?? [];
  const userName = user ? getUserName(user, true) : null;
  const appName = app?.name;

  const attribution = userName ? (
    <Text size={3} color="default2" as="span" marginLeft={1}>
      by{" "}
      <Link to={staffMemberDetailsUrl(user!.id)} className={styles.userLink}>
        <Text size={3} color="default2" as="span">
          {userName}
        </Text>
      </Link>
    </Text>
  ) : appName && app ? (
    <Text size={3} color="default2" as="span" marginLeft={1}>
      by{" "}
      <Link
        to={ExtensionsPaths.resolveViewManifestExtension(encodeURIComponent(app.id))}
        className={styles.userLink}
      >
        <Text size={3} color="default2" as="span">
          {appName}
        </Text>
      </Link>
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
              {elements.map(({ text, link }, index) => {
                if (link) {
                  return (
                    <Link to={link} key={`timeline-event-${link}-${index}`}>
                      <Text marginRight={0.5} size={3} color="default1" textDecoration="underline">
                        {text}
                      </Text>
                    </Link>
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
            {dateNode || <DateTime date={date} plain={hasPlainDate} />}
          </Text>
          {children}
        </Box>
      </Box>
    </Box>
  );
};
