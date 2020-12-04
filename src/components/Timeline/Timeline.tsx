import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CardContent from "@material-ui/core/CardContent";
import deepPurple from "@material-ui/core/colors/deepPurple";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import PersonIcon from "@material-ui/icons/Person";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

const useStyles = makeStyles(
  theme => ({
    avatar: {
      "& span": {
        height: "100%",
        width: "100%"
      },
      alignSelf: "flex-start",
      marginRight: theme.spacing(3.5)
    },
    button: {
      zIndex: 2
    },
    cardActionsExpanded: {
      maxHeight: theme.spacing(6)
    },
    input: {
      "& > div": {
        padding: "0 14px"
      },
      "& textarea": {
        "&::placeholder": {
          opacity: [[1], "!important"] as any
        },
        zIndex: 2
      },
      background: theme.palette.background.paper
    },
    noteRoot: {
      left: -theme.spacing(8.5) - 1,
      marginBottom: theme.spacing(3),
      position: "relative",
      width: `calc(100% + ${theme.spacing(8.5)}px)`
    },
    noteTitle: {
      "&:last-child": {
        paddingBottom: 0,
        paddingRight: 0
      },
      alignItems: "center",
      background: theme.palette.background.default,
      display: "flex",
      paddingLeft: theme.spacing(3)
    },
    root: {
      borderColor: theme.palette.divider,
      borderStyle: "solid",
      borderWidth: "0 0 0 2px",
      marginLeft: 20,
      paddingLeft: theme.spacing(3)
    }
  }),
  { name: "Timeline" }
);

interface TimelineProps {
  children?: React.ReactNode;
}

interface TimelineAddNoteProps {
  message: string;
  reset: () => void;
  onChange(event: React.ChangeEvent<any>);
  onSubmit(event: React.FormEvent<any>);
}

export const Timeline: React.FC<TimelineProps> = props => {
  const { children } = props;

  const classes = useStyles(props);

  return <div className={classes.root}>{children}</div>;
};

export const TimelineAddNote: React.FC<TimelineAddNoteProps> = props => {
  const { message, onChange, onSubmit, reset } = props;
  const classes = useStyles(props);

  const intl = useIntl();

  const submit = e => {
    reset();
    onSubmit(e);
  };

  return (
    <div className={classes.noteRoot}>
      <CardContent className={classes.noteTitle}>
        <Avatar
          style={{ background: deepPurple[500] }}
          className={classes.avatar}
        >
          <PersonIcon />
        </Avatar>
        <TextField
          className={classes.input}
          placeholder={intl.formatMessage({
            defaultMessage: "Leave your note here..."
          })}
          onChange={onChange}
          value={message}
          name="message"
          fullWidth
          multiline
          InputProps={{
            endAdornment: (
              <Button
                className={classes.button}
                color="primary"
                onClick={e => submit(e)}
              >
                <FormattedMessage
                  defaultMessage="Send"
                  description="add order note, button"
                />
              </Button>
            )
          }}
          variant="outlined"
        />
      </CardContent>
    </div>
  );
};

Timeline.displayName = "Timeline";
export default Timeline;
