import { Avatar, Card, CardContent, Typography } from "@material-ui/core";
import * as colors from "@material-ui/core/colors";
import PersonIcon from "@material-ui/icons/Person";
import { makeStyles } from "@saleor/macaw-ui";
import CRC from "crc-32";
import React from "react";

import { DateTime } from "../Date";

const palette = [
  colors.amber,
  colors.blue,
  colors.cyan,
  colors.deepOrange,
  colors.deepPurple,
  colors.green,
  colors.indigo,
  colors.lightBlue,
  colors.lightGreen,
  colors.lime,
  colors.orange,
  colors.pink,
  colors.purple,
  colors.red,
  colors.teal,
  colors.yellow,
].map(color => color[500]);

const useStyles = makeStyles(
  theme => ({
    avatar: {
      left: -45,
      position: "absolute",
      top: 0,
    },
    card: {
      marginBottom: theme.spacing(3),
      marginLeft: theme.spacing(3),
      position: "relative",
    },
    cardContent: {
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
      paddingLeft: theme.spacing(3),
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
  const { date, user, message } = props;

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
        <Avatar
          className={classes.avatar}
          style={{ background: palette[CRC.str(user.email) % palette.length] }}
        >
          <PersonIcon />
        </Avatar>
      )}
      <div className={classes.title}>
        <Typography>{getUserTitleOrEmail()}</Typography>
        <Typography>
          <DateTime date={date} />
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
