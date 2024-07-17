import { GiftCardEventFragment, OrderEventFragment } from "@dashboard/graphql";
import { getUserInitials, getUserName } from "@dashboard/misc";
import { makeStyles } from "@saleor/macaw-ui";
import { Text } from "@saleor/macaw-ui-next";
import React from "react";

import { DashboardCard } from "../Card";
import { DateTime } from "../Date";
import { UserAvatar } from "../UserAvatar";

const useStyles = makeStyles(
  theme => ({
    avatar: {
      left: -40,
      position: "absolute",
      top: 0,
    },
    root: {
      position: "relative",
    },
    title: {
      "& p": {
        fontSize: "14px",
      },
      alignItems: "center",
      display: "flex",
      justifyContent: "space-between",
      marginBottom: theme.spacing(),
    },
  }),
  { name: "TimelineNote" },
);

interface TimelineNoteProps {
  date: string;
  message: string | null;
  user: OrderEventFragment["user"];
  app: OrderEventFragment["app"] | GiftCardEventFragment["app"];
  hasPlainDate?: boolean;
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
  app: OrderEventFragment["app"] | GiftCardEventFragment["app"];
  className: string;
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
}) => {
  const classes = useStyles();

  const userDisplayName = getUserName(user, true) ?? app?.name;

  return (
    <div className={classes.root}>
      <TimelineAvatar user={user} app={app} className={classes.avatar} />
      <div className={classes.title}>
        <Text size={3}>{userDisplayName}</Text>
        <Text size={3} color="default2" whiteSpace="nowrap">
          <DateTime date={date} plain={hasPlainDate} />
        </Text>
      </div>
      <DashboardCard
        marginBottom={6}
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
    </div>
  );
};
TimelineNote.displayName = "TimelineNote";
export default TimelineNote;
