// @ts-strict-ignore
import { OrderEventFragment } from "@dashboard/graphql";
import { getUserInitials, getUserName } from "@dashboard/misc";
import { Card, CardContent, Typography } from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";
import { vars } from "@saleor/macaw-ui-next";
import React from "react";

import { DateTime } from "../Date";
import { UserAvatar } from "../UserAvatar";

const useStyles = makeStyles(
  theme => ({
    avatar: {
      left: -40,
      position: "absolute",
      top: 0,
    },
    card: {
      marginBottom: theme.spacing(3),
      position: "relative",
      boxShadow: "none",
      background: vars.colors.background.default1,
    },
    cardContent: {
      wordBreak: "break-all",
      borderRadius: "4px",
      border: `1px solid ${vars.colors.border.default1}`,
      "&:last-child": {
        padding: 16,
      },
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
  hasPlainDate?: boolean;
}

interface NoteMessageProps {
  message: string;
}

const NoteMessage: React.FC<NoteMessageProps> = ({ message }) => (
  <>
    {message.split("\n").map(string => {
      if (string === "") {
        return <br key={`break-${string}`} />;
      }

      return <Typography key={`note-${string}`}>{string}</Typography>;
    })}
  </>
);

export const TimelineNote: React.FC<TimelineNoteProps> = props => {
  const { date, user, message, hasPlainDate } = props;

  const classes = useStyles(props);

  const userDisplayName = getUserName(user, true);

  return (
    <div className={classes.root}>
      {user && (
        <UserAvatar
          initials={getUserInitials(user)}
          url={user?.avatar?.url}
          className={classes.avatar}
        />
      )}
      <div className={classes.title}>
        <Typography>{userDisplayName}</Typography>
        <Typography>
          <DateTime date={date} plain={hasPlainDate} />
        </Typography>
      </div>
      <Card className={classes.card} elevation={16}>
        <CardContent className={classes.cardContent}>
          <NoteMessage message={message} />
        </CardContent>
      </Card>
    </div>
  );
};
TimelineNote.displayName = "TimelineNote";
export default TimelineNote;
