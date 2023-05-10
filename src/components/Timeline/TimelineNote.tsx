import { useUser } from "@dashboard/auth";
import { getUserInitials } from "@dashboard/misc";
import { Card, CardContent, Typography } from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";
import { vars } from "@saleor/macaw-ui/next";
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
      background: vars.colors.background.surfaceNeutralPlain,
    },
    cardContent: {
      wordBreak: "break-all",
      borderRadius: "4px",
      border: `1px solid ${vars.colors.border.neutralDefault}`,
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
  user: {
    email: string;
    firstName?: string;
    lastName?: string;
  };
  hasPlainDate?: boolean;
}

interface NoteMessageProps {
  message: string;
}

const NoteMessage: React.FC<NoteMessageProps> = ({ message }) => (
  <>
    {message.split("\n").map(string => {
      if (string === "") {
        return <br />;
      }

      return <Typography>{string}</Typography>;
    })}
  </>
);

export const TimelineNote: React.FC<TimelineNoteProps> = props => {
  const { date, user, message, hasPlainDate } = props;
  const { user: currentUser } = useUser();

  const classes = useStyles(props);

  const getUserTitleOrEmail = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }

    return user?.email;
  };

  return (
    <div className={classes.root}>
      {user && (
        <UserAvatar
          initials={getUserInitials(currentUser)}
          url={currentUser?.avatar?.url}
          className={classes.avatar}
        />
      )}
      <div className={classes.title}>
        <Typography>{getUserTitleOrEmail()}</Typography>
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
