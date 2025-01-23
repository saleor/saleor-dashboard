import { GiftCardEventsQuery, OrderEventFragment } from "@dashboard/graphql";
import { getUserInitials, getUserName } from "@dashboard/misc";
import { Box, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage } from "react-intl/lib";

import { DashboardCard } from "../Card";
import { DateTime } from "../Date";
import { UserAvatar } from "../UserAvatar";

type TimelineAppType =
  | NonNullable<GiftCardEventsQuery["giftCard"]>["events"][0]["app"]
  | OrderEventFragment["app"];

interface TimelineNoteProps {
  date: string;
  message: string | null;
  user: OrderEventFragment["user"];
  app: TimelineAppType;
  hasPlainDate?: boolean;
  id: string;
  relatedId?: string;
}

interface NoteMessageProps {
  message: string | null;
}

const NoteMessage: React.FC<NoteMessageProps> = ({ message }) => (
  <>
    {message?.split("\n").map(string => {
      if (string === "") {
        return <br key={`break-${string}`} />;
      }

      return <Text key={`note-${string}`}>{string}</Text>;
    })}
  </>
);

const TimelineAvatar = ({
  user,
  app,
  className,
}: {
  user: OrderEventFragment["user"];
  app: TimelineAppType;
  className?: string;
}) => {
  if (user) {
    return (
      <UserAvatar initials={getUserInitials(user)} url={user?.avatar?.url} className={className} />
    );
  }

  if (app) {
    return (
      <UserAvatar
        initials={app.name?.slice(0, 2)}
        url={app.brand?.logo?.default}
        className={className}
      />
    );
  }

  return null;
};

export const TimelineNote: React.FC<TimelineNoteProps> = ({
  date,
  user,
  message,
  hasPlainDate,
  app,
  id,
  relatedId,
}) => {
  const userDisplayName = getUserName(user, true) ?? app?.name;

  return (
    <Box position="relative">
      <Box position="absolute" top={0} __left={-40}>
        <TimelineAvatar user={user} app={app} />
      </Box>
      <Box marginBottom={2} display="flex" alignItems="center" justifyContent="space-between">
        <Text size={3}>{userDisplayName}</Text>
        <Text size={3} color="default2" display="flex" gap={1} whiteSpace="nowrap">
          {relatedId ? (
            <FormattedMessage defaultMessage="updated" id="fM7xZh" />
          ) : (
            <FormattedMessage defaultMessage="added" id="xJEaxW" />
          )}
          <DateTime date={date} plain={hasPlainDate} />
        </Text>
      </Box>
      <DashboardCard
        marginBottom={2}
        position="relative"
        boxShadow="defaultOverlay"
        backgroundColor="default1"
      >
        <DashboardCard.Content
          wordBreak="break-all"
          borderRadius={2}
          borderStyle="solid"
          borderWidth={1}
          borderColor="default1"
          padding={4}
        >
          <NoteMessage message={message} />
        </DashboardCard.Content>
      </DashboardCard>

      <Box marginBottom={6} display="flex" justifyContent="space-between" alignItems="center">
        <Text size={2} color="defaultDisabled">
          <FormattedMessage defaultMessage="Note id" id="/n+NRO" />: {id}
        </Text>
        {relatedId && (
          <Text size={2} color="defaultDisabled">
            <FormattedMessage defaultMessage="Related note id" id="dVSBW6" /> : {relatedId}
          </Text>
        )}
      </Box>
    </Box>
  );
};
TimelineNote.displayName = "TimelineNote";
export default TimelineNote;
