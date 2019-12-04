import Avatar from "@material-ui/core/Avatar";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import * as colors from "@material-ui/core/colors";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import PersonIcon from "@material-ui/icons/Person";
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
  colors.yellow
].map(color => color[500]);

const useStyles = makeStyles(
  theme => ({
    avatar: {
      left: -45,
      position: "absolute",
      top: 0
    },
    card: {
      marginBottom: theme.spacing(3),
      marginLeft: theme.spacing(3),
      position: "relative"
    },
    cardContent: {
      "&:last-child": {
        padding: 16
      },
      boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.05)"
    },
    root: {
      position: "relative"
    },
    title: {
      "& p": {
        fontSize: "14px"
      },
      alignItems: "center",
      display: "flex",
      justifyContent: "space-between",
      marginBottom: theme.spacing(),
      paddingLeft: theme.spacing(3)
    }
  }),
  { name: "TimelineNote" }
);

interface TimelineNoteProps {
  date: string;
  message: string | null;
  user: {
    email: string;
  };
}

export const TimelineNote: React.FC<TimelineNoteProps> = props => {
  const { date, user, message } = props;

  const classes = useStyles(props);

  return (
    <div className={classes.root}>
      <Avatar
        className={classes.avatar}
        style={{ background: palette[CRC.str(user.email) % palette.length] }}
      >
        <PersonIcon />
      </Avatar>
      <div className={classes.title}>
        <Typography>{user.email}</Typography>
        <Typography>
          <DateTime date={date} />
        </Typography>
      </div>
      <Card className={classes.card}>
        <CardContent className={classes.cardContent}>
          <Typography
            dangerouslySetInnerHTML={{
              __html: message.replace("\n", "<br />")
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
};
TimelineNote.displayName = "TimelineNote";
export default TimelineNote;
